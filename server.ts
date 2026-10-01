import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Initialize Gemini API client on server-side
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API endpoint: Coaching Staff Tactical & Medical AI Consultation
  app.post('/api/tactical/ai-consult', async (req, res) => {
    try {
      const { player, context, query, section } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY no está configurada en las variables de entorno.',
          fallback: true,
        });
      }

      const systemInstruction = `Eres el Director de Metodología y Rendimiento de Fútbol Profesional de un club de élite. 
Analizas datos de GPS (Catapult/Wyscout), fatiga neuromuscular (CK, ACWR, velocidad punta), y táctica posicional.
Tu tono es analítico, profesional, directo y aplicable a nivel de banquillo y cuerpo médico.
Jugador bajo análisis: Carlos Restrepo (26 años, Mediocentro Organizador / Pivote).
Contexto: Post-Final Regional, 310 minutos semanales acumulados, 13.2 km recorridos (+25%), caída de velocidad punta a 28 km/h (-10%), precisión de pases 62% (promedio 85%).
Estado médico: Zona roja de lesión isquiotibial, fatiga cognitiva y neuromuscular aguda. Recomendación: Descanso absoluto próximo partido.`;

      const promptText = `Consulta del cuerpo técnico:
Sección: ${section || 'General'}
Detalle de la consulta: ${query}

Proporciona una respuesta técnica estructurada con:
1. Diagnóstico / Análisis táctico-físico breve
2. Prescripción o ajuste metodológico concreto (ejercicios, protocolos o consignas tácticas en campo)
3. Criterio de control o métrica de seguimiento.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({
        success: true,
        analysis: response.text,
      });
    } catch (err: any) {
      console.error('Error en consulta de Gemini:', err);
      return res.status(500).json({
        error: err.message || 'Error al procesar consulta estratégica.',
      });
    }
  });

  // API endpoint: Generate Matchup Scenario Simulation
  app.post('/api/tactical/simulate-matchup', async (req, res) => {
    try {
      const { opponentProfile } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(503).json({
          error: 'GEMINI_API_KEY no configurada',
          fallback: true,
        });
      }

      const promptText = `Genera un análisis de vulnerabilidad táctica si Carlos Restrepo juega contra un rival con estilo: "${opponentProfile}".
Considera su velocidad punta mermada a 28 km/h y su tasa de pase del 62%.
Formato breve:
- Factor de Riesgo Principal (1 frase)
- Desencadenante de Pérdida (Pressing Trigger)
- Probabilidad de Transición en Contra
- Solución Táctica Alternativa (alinear sustituto o cambiar dibujo táctico).`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          temperature: 0.3,
        },
      });

      return res.json({
        success: true,
        simulation: response.text,
      });
    } catch (err: any) {
      console.error('Error en simulación:', err);
      return res.status(500).json({
        error: err.message || 'Error en simulación',
      });
    }
  });

  // API endpoint: Generate Comprehensive Strategic Report for any player
  app.post('/api/tactical/generate-report', async (req, res) => {
    try {
      const { player, metrics, customContext } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.json({
          success: true,
          reportText: `DIAGNÓSTICO AUTOMÁTICO DE RENDIMIENTO:\nJugador: ${player.name} (${player.position}, #${player.number})\nCarga: ${player.weeklyMinutes} min | ACWR: ${player.acwr}\nDictamen Fisiológico: ${player.status === 'REST_ABSOLUTE' ? 'DESCANSO ABSOLUTO (Zona Roja)' : player.status === 'CAUTION' ? 'MINUTOS REGULADOS (Zona Ámbar)' : 'ALTA COMPETITIVA'}.\n\nRecomendaciones:\n1. Ajustar volumen de carrera y dosificación de impactos según ratio agudo:crónico.\n2. Prescribir protocolos de hidroterapia y control de fatiga excéntrica.\n3. Aplicar consignas tácticas para evitar pérdidas en transiciones.`,
          timestamp: new Date().toISOString(),
          fallback: true,
        });
      }

      const promptText = `Genera un "Reporte Estratégico de Rendimiento" formal y profesional para el siguiente jugador:
Nombre: ${player.name}
Posición: ${player.position} (#${player.number})
Edad: ${player.age} años
Contexto: ${customContext || player.context}
Carga semanal: ${player.weeklyMinutes} min (ACWR: ${player.acwr})
Estado actual: ${player.status} (Riesgo: ${player.injuryRisk})
Métricas clave:
${metrics.map((m: any) => `- ${m.label}: ${m.currentValue} ${m.unit} (Promedio: ${m.baselineValue} ${m.unit}, Var: ${m.deltaPercent}%) - ${m.interpretation}`).join('\n')}

Estructura requerida:
1. DICTAMEN MÉDICO-TÁCTICO EJECUTIVO (Una decisión tajante: Descanso absoluto, Minutos regulados o Alta)
2. EVALUACIÓN FISIOLÓGICA & NEUROMUSCULAR (Volumen vs Intensidad, fatiga periférica o central)
3. IMPLICACIONES TÁCTICAS EN EL MODELO DE JUEGO (Riesgos de transiciones o pressing triggers)
4. PLAN DE ACCIÓN PARA EL CUERPO TÉCNICO (Cuerpo médico, videoanálisis y tareas de campo)`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptText,
        config: {
          systemInstruction: 'Eres el Director de Rendimiento y Metodología de un club de fútbol profesional. Tu redacción es rigurosa, clínica, táctica y orientada a decisiones de alta competición.',
          temperature: 0.3,
        },
      });

      return res.json({
        success: true,
        reportText: response.text,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error generando reporte:', err);
      return res.status(500).json({
        error: err.message || 'Error al generar reporte estratégico.',
      });
    }
  });

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor de inteligencia deportiva activo en http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fallo al inicializar servidor:', err);
  process.exit(1);
});
