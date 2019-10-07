///<reference path="../../../typings/index.d.ts"/>
import { expect } from 'chai';
import { describe, it } from 'mocha';
import {Optional, Config} from "../../main/typescript/Monad";

//TODO saveResolveTest
describe('optional tests', () => {
    it('fromnullable null', () => {
        expect(Optional.fromNullable(null).isPresent()).to.be.false;
        expect(Optional.fromNullable(null).isAbsent()).to.be.true;
    });
    it('fromnullable absent', () => {
        expect(Optional.fromNullable(Optional.absent).isPresent()).to.be.false;
    });
    it('fromnullable value', () => {
        expect(Optional.fromNullable(1).isPresent()).to.be.true;
        expect(Optional.fromNullable(1).isAbsent()).to.be.false;
    });

    it('flatmap/map test', () => {
        expect(Optional.fromNullable(Optional.fromNullable(1)).value).to.be.eq(<any>1);
        expect(Optional.fromNullable(Optional.fromNullable(1)).value).to.be.eq(<any>1);
    });

    it('flatmap2/map test', () => {
        expect(Optional.fromNullable(Optional.fromNullable(null)).isAbsent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable()).isAbsent()).to.be.true;
    });

    it('elvis test', () => {
        var myStruct = {
            data: {
                value: 1,
                value2: Optional.absent,
                value4: Optional.fromNullable(1)
            },
            data2: [
                {booga: "hello"},
                "hello2"
            ]
        };
        expect(Optional.fromNullable(myStruct).getIf("data", "value").value).to.be.eq(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data", "value2").isAbsent()).to.be.true;
        expect(Optional.fromNullable(myStruct).getIf("data", "value3").isAbsent()).to.be.true;
        expect(Optional.fromNullable(myStruct).getIf("data", "value4").value).to.be.eq(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[1]").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2", "hello2").isPresent()).false;
        expect(Optional.fromNullable(Optional.fromNullable(Optional.fromNullable(myStruct))).getIf("data2[0]", "booga").value).to.be.eq("hello");

    });
});


describe('Config tests', () => {
    var setup = function ():Config {
        return new Config({
            data: {
                value: 1,
                value2: Optional.absent,
                value3: null
            },
            data2: [
                {booga: "hello"},
                "hello2"
            ]
        });
    };

    function structure(myStruct: any) {
        expect(Optional.fromNullable(myStruct).getIf("data", "value").value).to.be.eq(1);
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data", "value2").isAbsent()).to.be.true;
        expect(Optional.fromNullable(myStruct).getIf("data", "value3").isAbsent()).to.be.true;
        expect(Optional.fromNullable(myStruct).getIf("data", "value4").isAbsent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[1]").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2").isPresent()).to.be.true;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2", "hello2").isPresent()).false;
        expect(Optional.fromNullable(Optional.fromNullable(myStruct)).getIf("data2[0]", "booga").value).to.be.eq("hello");
    }

    function structureBroken(myStruct: any) {
        let valx = Optional.fromNullable(myStruct).getIf("data", "value").value;
        expect(!!Optional.fromNullable(myStruct).getIf("data", "value").value).to.be.false;
    }

    it('simple config', () => {
        let config = setup();
        config.apply("hello", "world", "from").value = "me";
        expect(Config.fromNullable(config.getIf("hello", "world", "from")).value).to.be.eq("me");
        expect(config.getIf("hello", "booga", "from").isAbsent()).to.be.eq(true);
        structure(config.value);

    });

    it('simple config2', () => {
        let config = setup();
        config.apply("hello", "world", "from").value = "me";
        expect(config.value.hello.world.from).to.be.eq("me");
        structure(config.value);
    });

    it('array config', () => {
        let config = setup();
        config.apply("hello[5]", "world[3]", "from[5]").value = "me";
        console.debug(JSON.stringify(config.toJson()));
        expect(config.getIf("hello[5]", "world[3]", "from[5]").value).to.be.eq("me");
        expect(config.value.hello[5].world[3].from[5]).to.be.eq("me");
        structure(config.value);
    });

    it('array config2', () => {
        let config = setup();
        config.apply("[5]", "world[3]", "from").value = "me";
        expect(config.getIf("[5]", "world[3]", "from").value).to.be.eq("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5].world[3].from).to.be.eq("me");
        structureBroken(config.value);
    });

    it('array config3', () => {
        let config = setup();
        config.apply("[5]", "[3]", "from").value = "me";
        expect(config.getIf("[5]", "[3]", "from").value).to.be.eq("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5][3].from).to.be.eq("me");
        structureBroken(config.value);
    });

    it('array config4', () => {
        let config = setup();
        config.apply("[5]", "[3]", "[2]").value = "me";
        expect(config.getIf("[5]", "[3]", "[2]").value).to.be.eq("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5][3][2]).to.be.eq("me");
        structureBroken(config.value);
    });

    it('array config5', () => {
        let config = setup();
        config.apply("[5]", "world[3]", "from[2]").value = "me";
        expect(config.getIf("[5]", "world[3]", "from[2]").value).to.be.eq("me");
        console.debug(JSON.stringify(config.toJson()));
        expect(config.value[5].world[3].from[2]).to.be.eq("me");
        structureBroken(config.value);
    });
});


