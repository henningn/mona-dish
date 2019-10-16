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

import {Optional} from "./Monad";
import {Lang} from "./Lang";
import {DomQuery} from "./DomQuery";

declare let ActiveXObject: any;

/**
 * xml query as specialized case for DomQuery
 */
export class XMLQuery extends DomQuery {

    constructor(rootNode: Document | string | DomQuery) {

        let createIe11DomQueryShim = (): DOMParser => {
            //at the time if wroting ie11 is the only relevant browser
            //left withut any DomQuery support
            let parser = new ActiveXObject("Microsoft.XMLDOM");
            parser.async = false;
            //we shim th dom parser from ie in
            return <any> {
                parseFromString: (text: string, contentType: string): Document => {
                    return parser.loadXML(text);
                }
            }
        };

        let parseXML = (xml: string): Document => {
            if(xml == null) {
                return null;
            }
            let domParser: DOMParser = Lang.saveResolveLazy<DOMParser>(
                () => new window.DOMParser(),
                (): DOMParser =>  createIe11DomQueryShim()
            ).value;
            return domParser.parseFromString(xml, "text/xml");
        };

        if(Lang.instance.isString(rootNode)) {
            super(parseXML(<string>rootNode))
        } else {
            super(rootNode);
        }
    }


    isXMLParserError(): boolean {
        return this.querySelectorAll("parsererror").isPresent();
    }



    toString(): string {
        let ret = [];
        this.eachElem((node: any) => {
            if (typeof (<any>window).XMLSerializer != "undefined") {
                ret.push(new (<any>window).XMLSerializer().serializeToString(node));
            } else if (typeof node.xml != "undefined") {
                ret.push(node.xml);
            }
        });
        return ret.join("");
    }



    parserErrorText(joinstr: string): string {
        return this.querySelectorAll("parsererror").textContent(joinstr);
    }

    static parseXML(txt: string): XMLQuery {
        return new  XMLQuery(txt);
    }

    static fromString(txt: string): XMLQuery {
        return new  XMLQuery(txt);
    }
}
