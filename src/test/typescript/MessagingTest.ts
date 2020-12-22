import {expect} from 'chai';
import {describe, it} from 'mocha';
import {Broker, Direction, Message} from "../../main/typescript/Messaging";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;


async function delay(milliseconds: number) {
    return new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });
}

let iframe = `
            <div id="received">false</div>
        `;

const CHANNEL = "booga";

let applyMessageReceiver = function (contentWindow: any, msg: Message, brokr = new Broker(contentWindow)) {
    contentWindow["passMessage"] = function (message: Message) {
        msg = message;
        brokr.registerListener("channel", message => {
            contentWindow.document.getElementById("received").innerHTML = message.message;
            console.log("iframe message", message.message);
        });
    }
    return msg;
};
describe('Broker tests', function () {

    beforeEach(function () {


        let dom = new JSDOM(`
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            </head>
            <body>
                <div id="id_1"></div>
                <div id="id_2"  booga="blarg" class="blarg2"></div>
                <div id="id_3" class="blarg1 blarg2"></div>
                <div id="id_4"></div>
                <iframe id="iframe1"></iframe>
                <div id="shadow1"></div>
            </body>
            </html>
    
    `, {
            contentType: "text/html",
            runScripts: "dangerously"
        });


        let window = dom.window;

        (<any>global).window = window;
        (<any>global).body = window.document.body;
        (<any>global).document = window.document;
        (<any>global).navigator = {
            language: "en-En"
        };

        /*this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];
        this.xhr.onCreate = (xhr) => {
            this.requests.push(xhr);
        };
        (<any>global).XMLHttpRequest = this.xhr;
        (<any>window).XMLHttpRequest = this.xhr;*/

    });

    /*relays a message from an iframe up into the global context*/
    it('from iframe to global', function () {

        let contentWindow = ((<any>global).document.getElementById('iframe1')).contentWindow;
        let iframeDoc = contentWindow.document;
        iframeDoc.write(iframe);
        expect(iframeDoc.querySelectorAll("#received").length > 0).to.be.true;

        let msg = new Message("booga");
        let iframeBroker = new Broker(contentWindow);
        let origBroker = new Broker();
        msg = applyMessageReceiver(contentWindow, msg, iframeBroker);

        //contentWindow.passMessage(msg);
        origBroker.broadcast("channel", msg);
        let messageReceived = false;

        origBroker.registerListener(CHANNEL, (msg: Message) => {
            messageReceived = msg.message == "booga";
        });

        msg = new Message("booga2");
        iframeBroker.broadcast("channel2", msg, Direction.UP);

        async function analyzeDelayed() {
            await delay(1000);
            expect(messageReceived).to.eq(true);
        }

        analyzeDelayed();
    });

    /**
     * pass a global message into an attached brokered iframe
     */
    it('from global to iframe', function () {

        let contentWindow = ((<any>global).document.getElementById('iframe1')).contentWindow;
        let iframeDoc = contentWindow.document;
        iframeDoc.write(iframe);
        expect(iframeDoc.querySelectorAll("#received").length > 0).to.be.true;

        let msg = applyMessageReceiver(contentWindow, new Message("booga"));
        let broker = new Broker();
        contentWindow.passMessage(msg);
        broker.broadcast("channel", msg);

        msg = new Message("booga2");
        broker.broadcast("channel2", msg);

        async function analyzeDelayed() {
            await delay(400);
            expect(iframeDoc.querySelectorAll("#received")[0].innerHTML).to.eq("booga");
        }

        analyzeDelayed();
    });

    it('basic message', function () {
        let broker = new Broker();
        let messageReceived = false;
        broker.registerListener("channel", (message: Message): void => {
            messageReceived = message.message === "booga";
        })

        broker.broadcast("channel", new Message("booga"), Direction.DOWN, false);
        expect(messageReceived).to.be.true;
    });

    it('bidirectional message', function () {
        let broker = new Broker();
        let answerReceived = false;
        broker.registerListener("channel", (message: Message): void => {
            setTimeout(() => broker.answer("channel", message, new Message("answer of booga")), 0);
        })

        return broker.request("channel", new Message("booga"), Direction.DOWN, false)
            .then((message2: Message) => {
                answerReceived = message2.message === "answer of booga";
                expect(answerReceived).to.be.true;
                return true;
            });

    });

    it('bidirectional message with two brokers', function () {
        let broker = new Broker();
        let broker2 = new Broker();
        let answerReceived = false;
        broker2.registerListener("channel", (message: Message): void => {
            setTimeout(() => broker.answer("channel", message, new Message("answer of booga")), 0);
        })

        return broker.request("channel", new Message("booga"), Direction.DOWN, true)
            .then((message2: Message) => {
                answerReceived = message2.message === "answer of booga";
                expect(answerReceived).to.be.true;
                return true;
            });
    });

    it('basic init', function () {
        expect(window?.document?.body).not.eq(null);
    });

    it('dual brokers in different systems', function () {

        let broker1 = new Broker();
        let broker2 = new Broker();


        let broker1CallCnt = 0;
        let broker2CallCnt = 0;


        broker1.registerListener(CHANNEL, (message: Message) => {
            broker1CallCnt++;
        });
        broker2.registerListener(CHANNEL, (message: Message) => {
            broker2CallCnt++;
        });

        broker1.broadcast(CHANNEL, new Message("booga"), Direction.ALL, true);


        expect(broker1CallCnt == 1).to.eq(true);
        expect(broker2CallCnt == 1).to.eq(true);

        broker2.broadcast(CHANNEL, new Message("booga"), Direction.ALL, true);

        expect(broker1CallCnt == 2).to.eq(true);
        expect(broker2CallCnt == 2).to.eq(true);

    });

    it('shadow dom handling', function () {
        //closed not possible this seals the element off entirely, this is a no go
        //also a closed shadow root is not recommended, there are other ways of achieving partial
        //isolation
        let shadowRoot: ShadowRoot = (<any>document.getElementById('shadow1')).attachShadow({mode: 'closed'});
        expect(shadowRoot != null).to.be.true;
        shadowRoot.innerHTML = "<div class='received'>false</div>";

        //we now attach the brokers
        let origBroker = new Broker(window, "orig");
        let shadowBroker = new Broker(shadowRoot, "shadow");


        let shadowBrokerReceived = 0;
        shadowBroker.registerListener(CHANNEL, (msg: Message) => {
            shadowBrokerReceived++;
        });

        let brokerReceived = 0;
        origBroker.registerListener(CHANNEL, (msg: Message) => {
            brokerReceived++;
        });

        //from root broker into shadow dom
        origBroker.broadcast(CHANNEL, new Message("booga"));
        expect(shadowBrokerReceived).to.be.eq(1);
        expect(brokerReceived).to.eq(1);

        //now from shadow dom into broker
        shadowBroker.broadcast(CHANNEL, new Message("booga2"), Direction.UP);
        expect(brokerReceived).to.eq(2);

        //not closed shadow dom works in a way, that you basically bind the broker as external
        //to the external element and then use the message handler to pass the data back into
        //your shadow Root ... the shadow root is basically an internal isolation you can pass
        //That way, but you have to do it yourself by defining a broker in your component

    });

    it("subelements", function () {
        let broker1 = new Broker();
        let broker2 = new Broker(document.getElementById("id_1"));
        let brokerReceived = 0;
        broker2.registerListener(CHANNEL, (msg: Message) => {
            brokerReceived++;
        });
        broker1.broadcast(CHANNEL, new Message("booga"));
        expect(brokerReceived).to.eq(1);
    });


    //TODO shadow dom...

});