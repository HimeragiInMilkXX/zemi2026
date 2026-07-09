dayjs.extend( window.dayjs_plugin_duration );

function timeDiffUntilTarget( onlyDay, timeString ) {

    const now = dayjs();

    const target = dayjs(`${now.year()}-${timeString ?? '07-30T14:20:00'}`);

    const ms = target.diff(now);

    if( ms <= 0 ) {
        clearInterval(timer);

        if( onlyDay ) return '00'
        return 'ON AIR';
    }

    const d = dayjs.duration( ms );

    const totalDays = Math.floor( d.asDays() );
    const hours = d.hours();
    const minutes = d.minutes();
    const seconds = d.seconds();

    const pad2 = n => String(n).padStart(2, "0");

    if( onlyDay ) return pad2(totalDays);
    return `${totalDays}D:${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;

}

const headerSyncTime = document.getElementById("header-sync-time");
const closerSyncTime = document.getElementById("closer-sync-time");

const timer = setInterval( () => {
    
    const timeString = timeDiffUntilTarget( false )
    if( headerSyncTime.innerText != timeString ) headerSyncTime.innerText = timeString;

    const dayString = timeDiffUntilTarget( true );
    if( closerSyncTime.innerText != dayString ) closerSyncTime.innerText = dayString;
    
}, 1000 );


