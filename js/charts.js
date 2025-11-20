(function(){
    function initOverviewChart(){
        var el = document.getElementById('overviewChart');
        if(!el) return;
        if(typeof Chart === 'undefined'){
            console.warn('Chart.js not loaded');
            return;
        }
        var ctx = el.getContext('2d');
        var labels = ['G-9','G-8','G-7','G-6','G-5','G-4','G-3','G-2','G-1','G'];
        var data = {
            labels: labels,
            datasets: [
                { label: 'LeBron', data: [28,26,30,27,25,29,31,24,27,26], borderColor: '#1d428a', backgroundColor: 'rgba(29,66,138,0.08)', tension:0.25},
                { label: 'Giannis', data: [22,24,23,26,29,27,25,28,30,31], borderColor: '#005a9c', backgroundColor: 'rgba(0,90,156,0.06)', tension:0.25},
                { label: 'Curry', data: [31,29,33,30,35,32,28,34,36,34], borderColor: '#fdb927', backgroundColor: 'rgba(253,185,39,0.06)', tension:0.25}
            ]
        };
        new Chart(ctx, { type: 'line', data: data, options: { responsive: true, maintainAspectRatio: false, interaction:{mode:'index',intersect:false}, plugins:{legend:{position:'top'}}, scales:{y:{beginAtZero:false} } } });
    }

    function initPlayerCharts(){
        if(typeof Chart === 'undefined') return;
        var els = document.querySelectorAll('canvas.player-chart');
        els.forEach(function(el){
            try{
                var raw = el.getAttribute('data-values')||'';
                var values = raw.split(',').map(function(v){return Number(v.trim())||0;});
                var labels = values.map(function(_,i){return 'G'+(i+1)});
                var ctx = el.getContext('2d');
                new Chart(ctx, { type:'bar', data:{ labels: labels, datasets:[{ label: el.getAttribute('data-label')||'Stat', data: values, backgroundColor: 'rgba(29,66,138,0.55)' }] }, options:{responsive:true,maintainAspectRatio:false,scales:{y:{beginAtZero:true}}} });
            }catch(e){console.error(e)}
        });
    }

    function ready(fn){
        if(document.readyState!='loading') fn(); else document.addEventListener('DOMContentLoaded',fn);
    }

    ready(function(){
        initOverviewChart();
        initPlayerCharts();
    });
})();
