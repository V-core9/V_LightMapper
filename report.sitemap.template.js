module.exports = (data) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Report</title>
        
        <style>
            body {
                background: #101525;
            }
        
            #results {
                display: flex;
                flex-direction: column;
                padding: 1em;
                border: 1px solid orange;
                color: white;
                gap: 0.5em;
            }
        
            #results item {
                border: 1px solid gray;
                padding: 0.5em 1em;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }
        
        
            #results item:hover {
                background: #2196f330;
            }
        
            #results item name,
            #results item score {
                flex: 1;
                display: flex;
                justify-content: space-between;
            }
        
            [type='good'] {
                color: lime;
            }
        
            [type='avg'] {
                color: orange;
            }
        
            [type='bad'] {
                color: red;
            }
        
            #results item score>* {
                display: flex;
                flex: 1;
                justify-content: center;
                border: 1px solid;
            }
        
            #results item score>[type='bad'] {
                background: #ff00001a;
                border: none;
            }
        
            #results item score>[type='good'] {
                background: #33ff001a;
                border: none;
            }
        
            #results item score>[type='avg'] {
                background: #ffc8001a;
                border: none;
            }
        </style>
    </head>
    <body>
        <div id="results">
        </div>
        <script>
        const results = ${JSON.stringify(data, true, 2)}
        
        console.log(results);
    
        var domRes = \`<item>
                        <name>Page URL</name>
                        <score>
                            <perf>Performance</perf>
                            <bp>Best-Practices</bp>
                            <seo>SEO</seo>
                            <acc>Accessibility</acc>
                            <pwa>PWA</pwa>
                        </score>
                    </item>\`;
    
    
        const scores = {
            good: 90,
            avg: 70,
            bad: 50
        };
    
        score_to_word = (numb) => {
            return (numb > scores.avg) ? (numb > scores.good) ? 'good' : 'avg' : 'bad';
        };
    
        results.forEach(item => {
            console.log(item);
            domRes += \`<item>
                        <name>\${item.name}</name>
                        <score>
                            <perf type="\${score_to_word(item.perf)}">\${item.perf}</perf>
                            <bp type="\${score_to_word(item.bp)}">\${item.bp}</bp>
                            <seo type="\${score_to_word(item.seo)}">\${item.seo}</seo>
                            <acc type="\${score_to_word(item.acc)}">\${item.acc}</acc>
                            <pwa type="\${score_to_word(item.pwa)}">\${item.pwa}</pwa>
                        </score>
                    </item>\`;
        })
    
        document.querySelector("#results").innerHTML = domRes;
    
        </script>
    </body>
    
    </html>`;
};