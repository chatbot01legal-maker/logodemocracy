const { google } = require('googleapis');
require('dotenv').config();

console.log('=== VALIDACIÓN DE GOOGLE CALENDAR - PRODUCCIÓN ===\n');

async function validateGoogleCalendar() {
    try {
        // 1. Cargar y mostrar variables
        const env = {
            CLIENT_ID: process.env.CLIENT_ID,
            CLIENT_SECRET: process.env.CLIENT_SECRET,
            REFRESH_TOKEN: process.env.REFRESH_TOKEN,
            GOOGLE_CALENDAR_ID: process.env.GOOGLE_CALENDAR_ID,
            REDIRECT_URI: process.env.REDIRECT_URI
        };
        
        console.log('🔍 VARIABLES DE ENTORNO:');
        Object.entries(env).forEach(([key, value]) => {
            const isSet = value && value.trim().length > 0;
            const displayValue = isSet ? 
                (key.includes('TOKEN') || key.includes('SECRET') ? 
                 `${value.substring(0, 10)}... [${value.length} chars]` : value) :
                '❌ NO CONFIGURADA';
            console.log(`  ${key}: ${isSet ? '✅' : '❌'} ${displayValue}`);
        });
        
        // 2. Validar que todas las variables estén configuradas
        const missing = Object.entries(env).filter(([_, v]) => !v || v.trim() === '');
        if (missing.length > 0) {
            console.error(`\n❌ VARIABLES FALTANTES: ${missing.map(([k]) => k).join(', ')}`);
            return false;
        }
        
        // 3. Configurar OAuth2
        console.log('\n🔐 CONFIGURANDO OAUTH2...');
        const oauth2Client = new google.auth.OAuth2(
            env.CLIENT_ID,
            env.CLIENT_SECRET,
            env.REDIRECT_URI || 'https://developers.google.com/oauthplayground'
        );
        
        oauth2Client.setCredentials({
            refresh_token: env.REFRESH_TOKEN
        });
        
        // 4. Probar refresh token
        console.log('🔄 PROBANDO REFRESH TOKEN...');
        try {
            const { credentials } = await oauth2Client.refreshAccessToken();
            
            if (!credentials.access_token) {
                console.error('❌ NO SE PUDO OBTENER ACCESS TOKEN');
                console.log('   Posible causa: Refresh token inválido o expirado');
                return false;
            }
            
            console.log(`✅ ACCESS TOKEN OBTENIDO (expira: ${credentials.expiry_date ? new Date(credentials.expiry_date).toISOString() : 'N/A'})`);
            
        } catch (tokenError) {
            console.error(`❌ ERROR DE TOKEN: ${tokenError.message}`);
            
            if (tokenError.message.includes('invalid_grant')) {
                console.log('\n🔧 ACCIÓN REQUERIDA:');
                console.log('   1. Ve a https://developers.google.com/oauthplayground');
                console.log('   2. Autoriza con la cuenta del abogado');
                console.log('   3. Scope: https://www.googleapis.com/auth/calendar');
                console.log('   4. Copia el NUEVO refresh token');
                console.log('   5. Actualiza en Render: REFRESH_TOKEN');
            }
            return false;
        }
        
        // 5. Probar acceso a Google Calendar
        console.log('\n📅 PROBANDO GOOGLE CALENDAR API...');
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        
        // 5a. Listar calendarios
        console.log('   Listando calendarios accesibles...');
        const calendarList = await calendar.calendarList.list();
        const calendars = calendarList.data.items || [];
        
        console.log(`✅ CALENDARIOS ACCESIBLES: ${calendars.length}`);
        calendars.forEach(cal => {
            const isTarget = cal.id === env.GOOGLE_CALENDAR_ID;
            console.log(`   ${isTarget ? '🎯' : '  '} ${cal.summary} (${cal.id})`);
        });
        
        // 5b. Verificar calendario objetivo
        const targetCalendar = calendars.find(cal => cal.id === env.GOOGLE_CALENDAR_ID);
        if (!targetCalendar) {
            console.error(`\n❌ CALENDARIO OBJETIVO NO ENCONTRADO: ${env.GOOGLE_CALENDAR_ID}`);
            console.log('\n🔧 ACCIÓN REQUERIDA:');
            console.log('   1. Abre Google Calendar (cuenta del abogado)');
            console.log('   2. Busca el calendario objetivo');
            console.log('   3. Configuración → Compartir con personas específicas');
            console.log('   4. Agrega: ' + env.CLIENT_ID.split('-')[0] + '...@apps.googleusercontent.com');
            console.log('   5. Permisos: "Hacer cambios en eventos"');
            return false;
        }
        
        console.log(`\n✅ CALENDARIO OBJETIVO ACCESIBLE: ${targetCalendar.summary}`);
        
        // 6. Probar lectura de eventos
        console.log('\n📅 LEYENDO EVENTOS EXISTENTES...');
        const now = new Date();
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        const events = await calendar.events.list({
            calendarId: env.GOOGLE_CALENDAR_ID,
            timeMin: now.toISOString(),
            timeMax: nextWeek.toISOString(),
            maxResults: 5,
            singleEvents: true,
            orderBy: 'startTime'
        });
        
        const eventCount = events.data.items?.length || 0;
        console.log(`✅ EVENTOS PRÓXIMOS (7 días): ${eventCount}`);
        
        if (eventCount > 0) {
            events.data.items.slice(0, 3).forEach((event, i) => {
                const start = event.start.dateTime || event.start.date;
                console.log(`   ${i+1}. ${event.summary || 'Sin título'} - ${start}`);
            });
        }
        
        // 7. Resumen final
        console.log('\n🎉 VALIDACIÓN EXITOSA');
        console.log('══════════════════════════════════════════════════');
        console.log('   ✅ Todas las variables configuradas');
        console.log('   ✅ Refresh token válido');
        console.log('   ✅ Calendario objetivo accesible');
        console.log('   ✅ Permisos de lectura confirmados');
        console.log('══════════════════════════════════════════════════');
        console.log('\n📋 PRÓXIMOS PASOS:');
        console.log('   1. Testear endpoint: curl -s "https://chatbot-legal-widget.onrender.com/api/availability"');
        console.log('   2. Verificar logs en Render para confirmación');
        console.log('   3. Probar creación de evento desde frontend');
        
        return true;
        
    } catch (error) {
        console.error('\n❌ ERROR EN VALIDACIÓN:', error.message);
        
        if (error.code === 403) {
            console.log('\n🔧 ERROR DE PERMISOS (403):');
            console.log('   La cuenta de servicio no tiene acceso al calendario');
            console.log('   Comparte el calendario como se indicó anteriormente');
        }
        
        return false;
    }
}

// Ejecutar validación
validateGoogleCalendar().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error('Error inesperado:', error);
    process.exit(1);
});
