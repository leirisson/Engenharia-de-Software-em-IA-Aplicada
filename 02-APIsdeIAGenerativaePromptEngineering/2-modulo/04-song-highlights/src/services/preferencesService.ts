import { createClient, type Client } from '@libsql/client';
import type { ConversationSummary } from '../prompts/v1/summarization.ts';
import type { UserPreferences } from '../prompts/v1/chatResponse.ts';

export class PreferencesService {
  private db: Client;
  private isSetup = false;

  constructor(dbPath: string) {
    this.db = createClient({ url: dbPath.startsWith('file:') ? dbPath : `file:${dbPath}` });
  }

  async setup(): Promise<void> {
    if (this.isSetup) return;

    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT UNIQUE NOT NULL,
        name TEXT,
        age INTEGER,
        favorite_genres TEXT,
        favorite_bands TEXT,
        key_preferences TEXT,
        important_context TEXT,
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    this.isSetup = true;
  }

  async mergePreferences(userId: string, prefs: UserPreferences): Promise<void> {
    await this.setup();

    const existing = await this.getSummary(userId);

    const mergedGenres = prefs.favoriteGenres?.length
      ? [...new Set([...(existing?.favoriteGenres || []), ...prefs.favoriteGenres])]
      : existing?.favoriteGenres;

    const mergedBands = prefs.favoriteBands?.length
      ? [...new Set([...(existing?.favoriteBands || []), ...prefs.favoriteBands])]
      : existing?.favoriteBands;

    const contextParts = [
      existing?.importantContext,
      prefs.mood && `Mood: ${prefs.mood}`,
      prefs.listeningContext && `Context: ${prefs.listeningContext}`,
      prefs.additionalInfo
    ].filter(Boolean);

    await this.db.execute({
      sql: `
        INSERT INTO user_preferences (user_id, name, age, favorite_genres, favorite_bands, key_preferences, important_context, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET
          name = excluded.name,
          age = excluded.age,
          favorite_genres = excluded.favorite_genres,
          favorite_bands = excluded.favorite_bands,
          key_preferences = excluded.key_preferences,
          important_context = excluded.important_context,
          updated_at = datetime('now')
      `,
      args: [
        userId,
        prefs.name || existing?.name || null,
        prefs.age || existing?.age || null,
        mergedGenres ? JSON.stringify(mergedGenres) : null,
        mergedBands ? JSON.stringify(mergedBands) : null,
        existing?.keyPreferences || null,
        contextParts.length > 0 ? contextParts.join('. ') : null,
      ],
    });
  }

  async storeSummary(userId: string, summary: ConversationSummary): Promise<void> {
    await this.setup();

    await this.db.execute({
      sql: `
        INSERT INTO user_preferences (user_id, name, age, favorite_genres, favorite_bands, key_preferences, important_context, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(user_id) DO UPDATE SET
          name = excluded.name,
          age = excluded.age,
          favorite_genres = excluded.favorite_genres,
          favorite_bands = excluded.favorite_bands,
          key_preferences = excluded.key_preferences,
          important_context = excluded.important_context,
          updated_at = datetime('now')
      `,
      args: [
        userId,
        summary.name || null,
        summary.age || null,
        summary.favoriteGenres ? JSON.stringify(summary.favoriteGenres) : null,
        summary.favoriteBands ? JSON.stringify(summary.favoriteBands) : null,
        summary.keyPreferences,
        summary.importantContext || null,
      ],
    });
  }

  async getSummary(userId: string): Promise<ConversationSummary | null> {
    await this.setup();

    const result = await this.db.execute({
      sql: 'SELECT * FROM user_preferences WHERE user_id = ? LIMIT 1',
      args: [userId],
    });

    const row = result.rows[0];
    if (!row) return null;

    return {
      name: row.name as string | undefined || undefined,
      age: row.age as number | undefined || undefined,
      favoriteGenres: row.favorite_genres ? JSON.parse(row.favorite_genres as string) : undefined,
      favoriteBands: row.favorite_bands ? JSON.parse(row.favorite_bands as string) : undefined,
      keyPreferences: row.key_preferences as string,
      importantContext: row.important_context as string | undefined || undefined,
    };
  }

  async getBasicInfo(userId: string): Promise<string | undefined> {
    const summary = await this.getSummary(userId);
    if (!summary) return undefined;

    const parts: string[] = [];

    if (summary.name) parts.push(`Nome: ${summary.name}`);
    if (summary.age) parts.push(`Idade: ${summary.age}`);
    if (summary.favoriteGenres?.length) {
      parts.push(`Gêneros Favoritos: ${summary.favoriteGenres.join(', ')}`);
    }
    if (summary.favoriteBands?.length) {
      parts.push(`Artistas/Bandas Favoritas: ${summary.favoriteBands.join(', ')}`);
    }
    if (summary.keyPreferences) {
      parts.push(`\nPreferências: ${summary.keyPreferences}`);
    }

    return parts.length > 0 ? parts.join('\n') : undefined;
  }

  async close(): Promise<void> {
    this.db.close();
  }
}
