import test from 'node:test'
import { app } from '../src/index.ts'

import assert from 'node:assert/strict'

test('commando upper transforms message into UPPERCASE', async () => {
    const msgLowerCase = "transforme essa mensagem em LOWER"
    const msgUpperCase = "transforme essa mensagem em UPPER"
    const expeted = msgUpperCase.toUpperCase()
    const response = await app.inject({
        method: "POST",
        url: "/chat",
        body: { question: msgUpperCase }
    })

    assert.equal(response.statusCode, 200)
    assert.equal(response.body, expeted)
})