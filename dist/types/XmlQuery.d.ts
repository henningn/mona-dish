import { DomQuery } from "./DomQuery";
/**
 * xml query as specialized case for DomQuery
 */
export declare class XMLQuery extends DomQuery {
    constructor(rootNode: Document | string | DomQuery, docType?: SupportedType);
    isXMLParserError(): boolean;
    toString(): string;
    parserErrorText(joinstr: string): string;
    static parseXML(txt: string): XMLQuery;
    static parseHTML(txt: string): XMLQuery;
    static fromString(txt: string, parseType?: SupportedType): XMLQuery;
}
export declare const XQ: typeof XMLQuery;
export declare type XQ = XMLQuery;
