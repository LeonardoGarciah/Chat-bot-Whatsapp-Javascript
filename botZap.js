const puppeteer = require('puppeteer');

(async() => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--window-size=1200,720'
        ],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1200, height: 600 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4676.0 Safari/537.36');
    await page.goto('https://web.whatsapp.com/');

    // await page.waitForSelector('#app > div._1ADa8.nMnIl.app-wrapper-web.font-fix.os-win > div > div.landing-window > div.landing-main > div > div._25pwu > div > canvas');
    await page.waitForSelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(2) > div > div');
    await delay(3000);
    // if(page.evaluate(()=>{
    //   return document.querySelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(3) > div > div');
    //})!=null)
    do {
        await delay(2000);
        var error = null;
        try {
            await page.click('div._3C4Vf');
        } catch (e) {
            error = e;
            console.log("Nenhuma mensagem nova!")
        }
        console.log(error);
    } while (error != null);

    await page.waitForSelector('._1PzAL');
    const editor = await page.$("div[data-tab='9']");
    await editor.focus();
    // await page.evaluate(() => {
    //     document.execCommand('insertText', false, "Opa!");
    //})

    //await page.click('span[data-testid=send]')
    var lastMessagesCount = 0;
    await page.evaluate(() => {
        let messageIn = document.querySelectorAll('.message-in');

        lastMessagesCount = messageIn.length;
    })
    console.log("No momento possuimos " + lastMessagesCount + " mensagens");

    while (true) {
        var ultimaMsg = await page.evaluate(() => {
            let tamanho = document.querySelectorAll('._2wUmf').length;
            let elemento = document.querySelectorAll('._2wUmf')[tamanho - 1].textContent;
            return elemento;
        })
        console.log(ultimaMsg);
        ultimaMsgA = ultimaMsg.replace(ultimaMsg.substring(ultimaMsg.length - 5, ultimaMsg.length), "");
        await delay(1000);
        await page.evaluate((ultimaMsgA) => {


            let messagesIn = document.querySelectorAll('.message-in');

            console.log(lastMessagesCount);

            if (messagesIn.length > lastMessagesCount || ultimaMsgA === "Oi" || ultimaMsgA === "cardapio") {

                console.log("Nova mensagem!");

                var msg1 = messagesIn[messagesIn.length - 1].textContent;
                var msg2 = msg1.replace(msg1.substring(msg1.length - 5, msg1.length), "");
                msg2 = msg2.toLowerCase();
                if (msg2.indexOf("á") != -1) {
                    msg2 = msg2.replace("á", "a");
                }
                document.querySelector("div[data-tab='9']").focus();
                if (msg2 === "cardapio") {
                    var date = new Date();
                    var d = date.getDay();
                    d = d - 1;
                    var diaSemana = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

                    if (diaSemana[d] === 'Segunda') {
                        document.execCommand('insertText', false, "Cardapio da " + diaSemana[d] + " é Arroz e feijão e carne!");
                    } else if (diaSemana[d] === 'Terça') {
                        document.execCommand('insertText', false, "Cardapio da " + diaSemana[d] + " é Arroz e feijão e frango!");
                    } else if (diaSemana[d] === 'Quarta') {
                        document.execCommand('insertText', false, "Cardapio da " + diaSemana[d] + " é Macarrão e Filé de frango!");
                    } else if (diaSemana[d] === 'Quinta') {
                        document.execCommand('insertText', false, "Cardapio da " + diaSemana[d] + " é Batata frita e arroz e feijão!");
                    } else if (diaSemana[d] === 'Sexta') {
                        document.execCommand('insertText', false, "Cardapio da " + diaSemana[d] + " é Macarrão com carne moida e farofa");
                    }


                    document.querySelectorAll('._4sWnG')[0].click()
                } else if (msg2 === "Oi") {
                    document.execCommand('insertText', false, "Insira *Cardapio* para ver o cardapio de hoje! :)");

                    document.querySelectorAll('._4sWnG')[0].click()
                } else if (msg2 != "Oi" || msg2 != "cardapio") {
                    document.execCommand('insertText', false, "Comando invalido! Insira *Cardapio* para ver o cardapio de hoje! :)");

                    document.querySelectorAll('._4sWnG')[0].click()
                }
                lastMessagesCount = messagesIn.length;
            } else {

                console.log("Nada novo :(");

            }

        }, ultimaMsgA)
        await delay(2000);
        var proseguir = false;
        while (proseguir == false) {
            try {
                await page.waitForSelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(2) > div > div');
                proseguir = true;
            } catch (e) {
                console.log("Nenhuma conversa nova");
                proseguir = false;
            }
        }
        await delay(1000);
        try {
            await page.click('div._3C4Vf');
        } catch (e) {
            console.log("Nenhuma mensagem nova!")
        }
        await delay(1000);
    }
})();

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}