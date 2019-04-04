import {Probe1, Probe1Impl, Probe2, Probe2Impl} from "./MappingProbes";

describe('mapping tests', () => {
    it('must map correctly', () => {
        let probe2: Probe2 = {val1: "hello from probe2"};

        let probe1: Probe1 = {
            val1: "hello from probe1",
            val2: new Date(),
            val3: {"hello": probe2},
            val4: [probe2, probe2],
            val5: probe2,
            val6: "something",
        };

        debugger;
        let probe1Impl = new Probe1Impl(probe1);



        expect(probe1Impl.val1).toEqual(probe1.val1);
        expect(probe1Impl.val4[1] instanceof Probe2Impl).toBe(true);
        expect(probe1Impl.val5 instanceof Probe2Impl).toBe(true);
        expect(probe1Impl.val3["hello"] instanceof Probe2Impl).toBe(true);
    });


});