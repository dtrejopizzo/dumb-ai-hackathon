# Configuración de DigitalOcean para TherapyForDogs.ai

Este proyecto usa **DigitalOcean Gradient AI Platform** para el agente conversacional y **DigitalOcean Spaces** para almacenar las sesiones de terapia.

## Paso 1: Crear una cuenta en DigitalOcean

1. Ve a [digitalocean.com](https://www.digitalocean.com)
2. Crea una cuenta o inicia sesión
3. Navega a la sección **Gradient AI Platform**

## Paso 2: Crear un Space (Almacenamiento)

1. En el panel de DigitalOcean, ve a **Spaces & Object Storage**
2. Haz clic en **Create Space**
3. Configura el Space:
   - **Datacenter Region**: Selecciona la región más cercana (ej: NYC3, SFO3)
   - **Space Name**: `therapyfordogs` (o el nombre que prefieras)
   - **Enable CDN**: Opcional
4. Crea el Space

## Paso 3: Obtener Spaces Access Keys

1. Ve a **API** → **Spaces Keys**
2. Haz clic en **Generate New Key**
3. Dale un nombre descriptivo (ej: "TherapyForDogs App")
4. Copia el **Access Key** y **Secret Key** (solo se muestran una vez)

## Paso 4: Crear un Agente AI

1. En el panel de DigitalOcean, ve a **Gen AI** → **Agents**
2. Haz clic en **Create Agent**
3. Configura el agente:
   - **Name**: `dog-therapist-agent`
   - **Model**: Selecciona un modelo compatible (ej: llama3.3-70b-instruct)
   - **System Prompt**: 
     \`\`\`
     Eres un terapeuta profesional de comportamiento canino. Tu trabajo es ayudar a los dueños de perros a entender y mejorar el comportamiento de sus mascotas. Eres empático, profesional, y proporcionas consejos prácticos basados en el reporte de evaluación comportamental que recibes.
     \`\`\`
4. Crea el agente y copia el **Agent Endpoint URL** (termina en `.agents.do-ai.run`)

## Paso 5: Obtener API Token

1. Ve a **API** → **Tokens** en el panel de DigitalOcean
2. Genera un nuevo **Personal Access Token**
3. Dale permisos de lectura/escritura para Gen AI
4. Copia el token (solo se muestra una vez)

## Paso 6: Configurar Variables de Entorno

Agrega estas variables en la sección **Vars** de v0:

\`\`\`
# DigitalOcean Spaces (para almacenar sesiones)
DO_SPACES_KEY=your_spaces_access_key
DO_SPACES_SECRET=your_spaces_secret_key
DO_SPACES_REGION=nyc3
DO_SPACES_BUCKET=therapyfordogs

# DigitalOcean AI Agent (para el chat)
DO_AGENT_ENDPOINT=https://your-agent-id.agents.do-ai.run
DO_API_TOKEN=dop_v1_xxxxxxxxxxxxxxxxxxxxx

# Replicate (para análisis de imágenes)
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxx
\`\`\`

## Paso 7: Probar la Aplicación

1. Sube una foto de un perro
2. Espera el reporte de evaluación (se guarda en DigitalOcean Spaces)
3. La URL será corta: `/session/session_123456_abc` (sin datos en la URL)
4. Haz clic en el botón de chat flotante (esquina inferior derecha)
5. Comienza a chatear con el terapista AI

## Arquitectura

\`\`\`
Usuario → Next.js App → Replicate (análisis de imagen)
                     ↓
              DigitalOcean Spaces (guardar sesión)
                     ↓
              Página de resultados
                     ↓
              Chat → DigitalOcean AI Agent
\`\`\`

## Características

### DigitalOcean Spaces
- **Almacenamiento**: Guarda análisis e imágenes de sesiones
- **URLs cortas**: Evita el error URI_TOO_LONG
- **Privado**: Los datos no están en la URL
- **Escalable**: Soporta miles de sesiones

### DigitalOcean AI Agent
- **Contexto**: Recibe el reporte completo de evaluación comportamental
- **Personalizado**: Responde en español con empatía y profesionalismo
- **Conversacional**: Mantiene el historial de la conversación
- **Práctico**: Proporciona consejos específicos basados en el reporte

## Costos

- DigitalOcean ofrece créditos gratuitos para nuevos usuarios
- El hackathon incluye $500 en créditos de DigitalOcean
- **Spaces**: $5/mes por 250GB + transferencia
- **AI Agents**: Se cobran por uso (tokens procesados)

## Troubleshooting

### Error: URI_TOO_LONG
✅ **Solucionado**: Ahora usamos DigitalOcean Spaces para almacenar datos

### Error: 404 al llamar al agente
- Verifica que `DO_AGENT_ENDPOINT` termine en `.agents.do-ai.run`
- Asegúrate de incluir `/api/v1` en el baseURL del código

### Error: Failed to store session
- Verifica las credenciales de Spaces (`DO_SPACES_KEY` y `DO_SPACES_SECRET`)
- Confirma que el bucket existe y el nombre coincide con `DO_SPACES_BUCKET`
- Revisa que la región sea correcta (`DO_SPACES_REGION`)

## Soporte

Si tienes problemas:
1. Verifica que todas las variables de entorno estén configuradas
2. Revisa los logs en la consola del navegador y del servidor
3. Consulta la [documentación de DigitalOcean](https://docs.digitalocean.com/products/gen-ai-platform/)
4. Revisa la [documentación de Spaces](https://docs.digitalocean.com/products/spaces/)
