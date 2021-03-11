import {expect} from 'chai';
import {describe, it} from 'mocha';
import {BroadcastChannelBroker, Broker, Message} from "../../main/typescript/Messaging";
import { BroadcastChannel as BC, enforceOptions } from 'broadcast-channel';

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


       (<any>window)["BroadcastChannel"] = BC;
        /*this.xhr = sinon.useFakeXMLHttpRequest();
        this.requests = [];
        this.xhr.onCreate = (xhr) => {
            this.requests.push(xhr);
        };
        (<any>global).XMLHttpRequest = this.xhr;
        (<any>window).XMLHttpRequest = this.xhr;*/
        // enforce this config for all channels
        enforceOptions({
            type: 'simulate'
        });

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
        iframeBroker.broadcast("channel2", msg);

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

        broker.broadcast("channel", new Message("booga"));
        expect(messageReceived).to.be.true;
    });

    it('bidirectional message', function () {
        let broker = new Broker();
        let answerReceived = false;
        broker.registerListener("channel", (message: Message): void => {
            setTimeout(() => broker.answer("channel", message, new Message("answer of booga")), 0);
        })

        return broker.request("channel", new Message("booga"))
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

        return broker.request("channel", new Message("booga"))
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

        broker1.broadcast(CHANNEL, new Message("booga"));


        expect(broker1CallCnt == 1).to.eq(true);
        expect(broker2CallCnt == 1).to.eq(true);

        broker2.broadcast(CHANNEL, new Message("booga"));

        expect(broker1CallCnt == 2).to.eq(true);
        expect(broker2CallCnt == 2).to.eq(true);

    });

    it('dual brokers in different systems sequence calls', function () {

        let chn1 = new BC("ddd");
        let chn2 = new BC("ddd");

        let chn1CallCnt = 0;
        let chn2CallCnt = 0;

        chn1.addEventListener("message", (message) => {
            console.log(message);
            chn1CallCnt++;
        });
        chn2.addEventListener("message", () => chn2CallCnt++);

        let broker1 = new BroadcastChannelBroker();
        let broker2 = new BroadcastChannelBroker();

        console.log("channels created");

        let broker1CallCnt = 0;
        let broker2CallCnt = 0;


        broker1.registerListener(CHANNEL, (message: Message) => {
            broker1CallCnt++;
        });
        broker2.registerListener(CHANNEL, (message: Message) => {
            broker2CallCnt++;
        });



        return  (async () => {
            await broker1.broadcast(CHANNEL, new Message("booga"));
            await broker1.broadcast(CHANNEL, new Message("booga"));
            await broker1.broadcast(CHANNEL, new Message("booga"));
            await chn1.postMessage({
                foo: 'bar'
            });
            await chn1.postMessage({
                foo: 'bar'
            });
            await delay(200);
            expect(chn1CallCnt == 0).to.be.true;
            expect(chn2CallCnt == 2).to.be.true;

            expect(broker1CallCnt == 3).to.eq(true);
            expect(broker2CallCnt == 3).to.eq(true);
            broker1.unregister();
            broker2.unregister();

        })();

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
        shadowBroker.broadcast(CHANNEL, new Message("booga2"));
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


    it("must work with Broadcast channel", function (done) {
        let broker1 = new BroadcastChannelBroker((group: string) => new BC(group));
        let broker2 = new BroadcastChannelBroker((group: string) => new BC(group));

        let brokerReceived = 0;
        new Promise((apply, reject) => {
            broker2.registerListener(CHANNEL, (msg: Message) => {
                brokerReceived++;
                apply(brokerReceived);
            })
            broker1.broadcast(CHANNEL, new Message("booga"));
        }).finally(() => {
            broker1.unregister();
            broker2.unregister();
            expect(brokerReceived).to.eq(1);
            done();
        })
    });


    it('shadow dom handling with Broadcast channel', async function () {
        //closed not possible this seals the element off entirely, this is a no go
        //also a closed shadow root is not recommended, there are other ways of achieving partial
        //isolation
        let shadowRoot: ShadowRoot = (<any>document.getElementById('shadow1')).attachShadow({mode: 'closed'});
        expect(shadowRoot != null).to.be.true;
        shadowRoot.innerHTML = "<div class='received'>false</div>";

        //we now attach the brokers

        let origBroker = new BroadcastChannelBroker();
        let shadowBroker = new BroadcastChannelBroker();


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

        await delay(100);

        expect(shadowBrokerReceived).to.be.eq(1);
        expect(brokerReceived).to.eq(1);

        //now from shadow dom into broker

        shadowBroker.broadcast(CHANNEL, new Message("booga2"));
        await delay(100);
        expect(brokerReceived).to.eq(2);
        origBroker.unregister();
        shadowBroker.unregister();

        //not closed shadow dom works in a way, that you basically bind the broker as external
        //to the external element and then use the message handler to pass the data back into
        //your shadow Root ... the shadow root is basically an internal isolation you can pass
        //That way, but you have to do it yourself by defining a broker in your component

    });


    it('basic message with broadcast', async function () {
        let broker = new BroadcastChannelBroker();
        let messageReceived = false;
        broker.registerListener("channel", (message: Message): void => {
            messageReceived = message.message === "booga";
        })

        broker.broadcast("channel", new Message("booga"));
        await delay(100);
        expect(messageReceived).to.be.true;
        broker.unregister();
    });

    it('basic message with broadcast ans string', async function () {
        let broker = new BroadcastChannelBroker();
        let messageReceived = false;
        broker.registerListener("channel", (message: Message): void => {
            messageReceived = message.message === "booga";
        })

        broker.broadcast("channel", "booga");
        await delay(100);
        expect(messageReceived).to.be.true;
        broker.unregister();
    });

    it('bidirectional message with Broadcast Channel', async function () {
        let broker = new BroadcastChannelBroker();
        let broker2 = new BroadcastChannelBroker();
        let answerReceived = false;
        broker2.registerListener("channel", (message: Message): void => {
            setTimeout(() => broker2.answer("channel", message, new Message("answer of booga")), 0);
        })

        return broker.request("channel", new Message("booga"))
            .then((message2: Message) => {
                answerReceived = message2.message === "answer of booga";
                expect(answerReceived).to.be.true;
                return true;
            }).finally(() => {
                broker.unregister();
                broker2.unregister();
            });
    });
})
