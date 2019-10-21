/* Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to you under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {expect} from 'chai';
import {describe, it} from 'mocha';
import {DomQuery} from "../../main/typescript/DomQuery";
import {ArrayCollector} from "../../main/typescript";

const jsdom = require("jsdom");
const {JSDOM} = jsdom;

describe('DOMQuery tests', () => {

    beforeEach(() => {

        let dom = new JSDOM(`
            <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>Title</title>
            </head>
            <body>
                <div id="id_1"></div>
                <div id="id_2"  booga="blarg"></div>
                <div id="id_3"></div>
                <div id="id_4"></div>
            </body>
            </html>
    
    `,  {
            contentType: "text/html",
            runScripts: "dangerously"
        })

        let window = dom.window;

        (<any>global).window = window;
        (<any>global).body = window.document.body;
        (<any>global).document = window.document;
        (<any>global).navigator = {
            language: "en-En"
        };
    });

    it('basic init', function () {
        let probe1 = new DomQuery(window.document.body);
        let probe2 = DomQuery.querySelectorAll("div");
        let probe3 = new DomQuery(probe1, probe2);
        let probe4 = new DomQuery(window.document.body, probe3);

        expect(probe1.length).to.be.eq(1);
        expect(probe2.length == 4).to.be.true;
        expect(probe3.length == 5).to.be.true;
        //still under discussion (we might index to avoid doubles)
        expect(probe4.length == 6).to.be.true;
    });

    it('domquery ops test filter', function () {
        let probe2 = DomQuery.querySelectorAll("div");
        probe2 = probe2.filter((item: DomQuery) => item.id.match((id) => id != "id_1"));
        expect(probe2.length == 3);
    });

    it('global eval test', function () {
        let probe2 = DomQuery.querySelectorAll("div");
        probe2 = probe2.filter((item: DomQuery) => item.id.match((id) => id != "id_1"));
        expect(probe2.length == 3);
    });

    it('must detach', function () {
        let probe2 = DomQuery.querySelectorAll("div#id_1");
        probe2.detach();

        expect(DomQuery.querySelectorAll("div#id_1").isPresent()).to.be.false;
        probe2.appendTo(DomQuery.querySelectorAll("body"));
        expect(DomQuery.querySelectorAll("div#id_1").isPresent()).to.be.true;
    });

    it('domquery ops test2 each', () => {
        let probe2 = DomQuery.querySelectorAll("div#id_1");

        DomQuery.globalEval("document.getElementById('id_1').innerHTML = 'hello'");
        expect(probe2.html().value).to.eq("hello");

        DomQuery.globalEval("document.getElementById('id_1').innerHTML = 'hello2'", "nonci");
        expect(probe2.html().value).to.eq("hello2");
    });

    it('domquery ops test2 eachNode', function () {
        let probe2 = DomQuery.querySelectorAll("div");
        let noIter = 0;
        probe2 = probe2.each((item, cnt) => {
            expect(item instanceof DomQuery).to.be.true;
            expect(noIter == cnt).to.be.true;
            noIter++;
        });
        expect(noIter == 4).to.be.true;
    });

    it('domquery ops test2 byId', function () {
        let probe2 = DomQuery.byId("id_1");
        expect(probe2.length == 1).to.be.true;
        probe2 = DomQuery.byTagName("div");
        expect(probe2.length == 4).to.be.true;
    });

    it('outerhtml and eval tests', function () {
        let probe1 = new DomQuery(window.document.body);
        probe1.querySelectorAll("#id_1").outerHTML(`
            <<div id='barg'>
            
            </div>
            <script type="text/javascript">
                document.getElementById('blarg').innerHTML = 'hello world';
            </script>
            `, true, true);
        expect(window.document.body.innerHTML.indexOf("hello world") != -1).to.be.true;
        expect(window.document.head.innerHTML.indexOf("hello world") == -1).to.be.true;
        expect(window.document.body.innerHTML.indexOf("id_1") == -1).to.be.true;
        expect(window.document.body.innerHTML.indexOf("blarg") != -1).to.be.true;
    });

    it('attrn test and eval tests', function () {

        let probe1 = new DomQuery(document);
        probe1.querySelectorAll("div#id_2").attr("style").value = "border=1;";
        let blarg = probe1.querySelectorAll("div#id_2").attr("booga").value;
        let style = probe1.querySelectorAll("div#id_2").attr("style").value;
        let nonexistent = probe1.querySelectorAll("div#id_2").attr("buhaha").value;

        expect(blarg).to.be.eq("blarg");
        expect(style).to.be.eq("border=1;");
        expect(nonexistent).to.be.eq(null);
    });

    it('must perform addClass and hasClass correctly', function () {
        let probe1 = new DomQuery(document);
        let element = probe1.querySelectorAll("div#id_2");
        element.addClass("booga").addClass("Booga2");

        let classdef = element.attr("class").value;
        expect(classdef).to.eq("booga Booga2");

        element.removeClass("booga2")
        expect(element.hasClass("booga2")).to.be.false;
        expect(element.hasClass("booga")).to.be.true;

    });

    it('must perform insert before and insert after correctly', function () {
        let probe1 = new DomQuery(document).querySelectorAll("#id_2");
        let insert = DomQuery.fromMarkup("<div id='insertedBefore'></div><div id='insertedBefore2'></div>")
        let insert2 = DomQuery.fromMarkup("<div id='insertedAfter'></div><div id='insertedAfter2'></div>")

        probe1.insertBefore(insert);
        probe1.insertAfter(insert2);

        expect(DomQuery.querySelectorAll("#insertedBefore").isPresent()).to.be.true;
        expect(DomQuery.querySelectorAll("#insertedBefore2").isPresent()).to.be.true;
        expect(DomQuery.querySelectorAll("#id_2").isPresent()).to.be.true;
        expect(DomQuery.querySelectorAll("#insertedAfter").isPresent()).to.be.true;
        expect(DomQuery.querySelectorAll("#insertedAfter2").isPresent()).to.be.true;
    });


    it('it must stream', function () {
        let probe1 = new DomQuery(document).querySelectorAll("div");
        let coll: Array<any> = probe1.stream.collect(new ArrayCollector());
        expect(coll.length == 4).to.be.true;

        coll = probe1.lazyStream.collect(new ArrayCollector());
        expect(coll.length == 4).to.be.true;

    });

    it('it must have parents', function () {
        let probe1 = new DomQuery(document).querySelectorAll("div");
        let coll: Array<any> = probe1.parents("body").stream.collect(new ArrayCollector());
        expect(coll.length == 1).to.be.true;


    });


});
