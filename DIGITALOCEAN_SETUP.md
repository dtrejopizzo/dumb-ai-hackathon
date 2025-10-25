# Configuración de DigitalOcean para TherapyForDogs.ai

Este proyecto usa **DigitalOcean Gradient AI Platform** para el agente conversacional de terapia canina.

## Paso 1: Crear una cuenta en DigitalOcean

1. Ve a [digitalocean.com](https://www.digitalocean.com)
2. Crea una cuenta o inicia sesión
3. Navega a la sección **Gradient AI Platform**

## Paso 2: Crear un Agente AI

1. En el panel de DigitalOcean, ve a **Gen AI** → **Agents**
2. Haz clic en **Create Agent**
3. Configura el agente:
   - **Name**: `dog-therapist-agent`
   - **Model**: Selecciona un modelo compatible (ej: GPT-4, Claude, Llama, etc.)
   - **System Prompt**: (Opcional - lo configuramos en el código)
4. Crea el agente y copia el **Agent Endpoint URL** (formato: `https://xxxxx.agents.do-ai.run`)

## Paso 3: Obtener API Token

1. Ve a **API** → **Tokens** en el panel de DigitalOcean
2. Genera un nuevo **Personal Access Token**
3. Dale permisos de lectura/escritura para Gen AI
4. Copia el token (solo se muestra una vez)

## Paso 4: Configurar Variables de Entorno

Agrega estas variables en la sección **Vars** de v0:

\`\`\`
DO_AGENT_ENDPOINT=https://xxxxx.agents.do-ai.run
DO_API_TOKEN=dop_v1_xxxxxxxxxxxxxxxxxxxxx
\`\`\`

**IMPORTANTE**: El `DO_AGENT_ENDPOINT` debe ser la URL completa del agente (termina en `.agents.do-ai.run`), NO la URL de la API de DigitalOcean.

## Paso 5: Probar el Chat

1. Sube una foto de un perro
2. Espera el reporte de evaluación
3. Haz clic en el botón de chat flotante (esquina inferior derecha)
4. Comienza a chatear con el terapista AI

## Arquitectura

\`\`\`
Usuario → Next.js App → /api/chat → OpenAI SDK → DigitalOcean Agent → Respuesta
                                    (con contexto del reporte)
\`\`\`

## Características del Agente

- **Contexto**: Recibe el reporte completo de evaluación comportamental
- **Personalizado**: Responde en español con empatía y profesionalismo
- **Conversacional**: Mantiene el historial de la conversación
- **Práctico**: Proporciona consejos específicos basados en el reporte
- **Compatible con OpenAI**: Usa el SDK de OpenAI para facilitar la integración

## Costos

- DigitalOcean ofrece créditos gratuitos para nuevos usuarios
- El hackathon incluye $500 en créditos de DigitalOcean
- Los agentes AI se cobran por uso (tokens procesados)

## Troubleshooting

### Error 404: "Not Found"
- Verifica que `DO_AGENT_ENDPOINT` sea la URL completa del agente (`.agents.do-ai.run`)
- NO uses la URL de la API de DigitalOcean (`api.digitalocean.com`)

### Error de autenticación
- Verifica que `DO_API_TOKEN` sea válido y tenga permisos de Gen AI
- El token debe empezar con `dop_v1_`

### El agente no responde correctamente
- Revisa los logs en la consola del navegador
- Verifica que el agente esté activo en el panel de DigitalOcean

## Soporte

Si tienes problemas:
1. Verifica que las variables de entorno estén configuradas correctamente
2. Revisa los logs en la consola del navegador (busca `[v0]`)
3. Consulta la [documentación de DigitalOcean](https://docs.digitalocean.com/products/gen-ai-platform/)
