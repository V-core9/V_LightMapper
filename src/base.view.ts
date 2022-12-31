module.exports = (data:any) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>V_LightMapper Report</title>
        <style>
            body {
                background: #101525;
                color: white;
                display: flex;
                flex-direction: column;
            }

            #results {
                display: flex;
                flex-direction: column;
                padding: 1em;
                border: 1px solid #1f2538;
                color: white;
                gap: 0.25em;
                flex: 1;
            }

            #results item {
                border: 1px solid #1f2538;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.25em .5em;
            }


            #results item:hover {
                background: #2196f330;
            }

            #results item name,
            #results item score {
                flex: 1;
                display: flex;
                justify-content: space-between;
                gap: 1em;
                align-items: center;
                font-size: 14px;
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
                border-left: 1px solid;
                font-size: 14px;
                text-align: center;
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

            header {
                background: #1f2538;
                display: flex;
                padding: 1em;
                align-items: center;
                justify-content: space-between;
            }

            footer {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding: 1em;
                background: #1f2538;
            }

            body #results>item:nth-child(1) name,
            body #results>item:nth-child(1) score {
                font-size: 22px;
                font-weight: bold;
                text-shadow: 0 0 5px black;
                padding: .5em;
                border: none;
                background: #101525;
            }

            #results>item name {
                padding: 0.25em 1em;
            }

            header * {
                margin: 0;
            }

            body #results>item:nth-child(1) {
                border: none;
            }

            body #results>item:nth-child(1):hover {
                background: transparent;
            }

            header h2 {
                font-size: 1em;
                color: #898989;
            }

            a {
                color: #2196f3;
            }

            header h2 span {
                background: #2196f3;
                padding: .25em 0.5em;
                color: white;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>🕯 LightMap : </h1>
            <h2>Execution Time <span>${data.execTime/1000}s</span></h2>
        </header>
        <div id="results">
        </div>
        <footer>
            <v_block>
                <v_text>Generated with <a href="https://npmjs.com/package/v_lightmapper">V_LightMapper</a>.</v_text>
            </v_block>
        </footer>
        <script>
        const results = ${JSON.stringify(data, null, 2)}

        console.info("INPUT DATA/results", results);

        let domRes = \`<item>
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

        results.pageRes.forEach(item => {
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
