const DEFAULT_LANGUAGES = ["en"];

function formatError(error) {
  if (!error) return "Unknown error";
  if (typeof error === "string") return error;
  return error.message ?? String(error);
}

export async function getAvailability(languages = DEFAULT_LANGUAGES) {
  if (!("LanguageModel" in self)) {
    throw new Error("LanguageModel API não está disponível neste browser/contexto.");
  }
  const availability = await LanguageModel.availability({ languages });
  console.log("LanguageModel.availability", { languages, availability });
  return availability;
}

export async function downloadLanguageModel(languages = DEFAULT_LANGUAGES) {
  const availability = await getAvailability(languages);

  if (availability === "available") {
    return { ok: true, availability };
  }

  if (availability === "unavailable") {
    return { ok: false, availability, error: "Dispositivo/Chrome não suportado para este idioma." };
  }

  if (availability === "downloading") {
    return { ok: false, availability, error: "Já está baixando. Aguarde e tente novamente." };
  }

  if (availability !== "downloadable") {
    return { ok: false, availability, error: `Estado inesperado: ${availability}` };
  }

  try {
    const session = await LanguageModel.create({
      expectedInputLanguages: languages,
      monitor(m) {
        m.addEventListener("downloadprogress", (e) => {
          const percent = e.total ? ((e.loaded / e.total) * 100).toFixed(0) : "0";
          console.log(`downloadprogress ${percent}%`, { loaded: e.loaded, total: e.total });
        });
      },
    });

    await session.prompt("Olá");
    session.destroy();

    const after = await getAvailability(languages);
    return { ok: after === "available", availability: after };
  } catch (error) {
    return { ok: false, availability: "downloadable", error: formatError(error) };
  }
}

export async function downloadTest(options = {}) {
  const languages = options.languages ?? DEFAULT_LANGUAGES;
  const result = await downloadLanguageModel(languages);
  console.log("downloadTest result:", result);
  return result;
}

globalThis.webAiDownload = {
  getAvailability,
  downloadLanguageModel,
  downloadTest,
};
