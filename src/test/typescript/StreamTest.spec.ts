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

import {describe} from "mocha";
import {LazyStream, Stream} from "../../main/typescript/Stream";
import {expect} from "chai";
import {ArrayCollector, ArrayStreamDataSource, SequenceDataSource} from "../../main/typescript";
import {from} from "rxjs";
import {ITERATION_STATUS} from "../../main/typescript/SourcesCollectors";

describe('early stream tests', () => {

    beforeEach(function () {
        this.probe = [1, 2, 3, 4, 5];
    });

    it("must iterate normal", function () {
        let stream = Stream.of<number>(...this.probe);
        let sum = 0;
        stream.each((data) => {
            sum = sum + data;
        });
        expect(sum).to.eq(15);

        let stream2 = LazyStream.of<number>(...this.probe);
        sum = 0;
        stream2.each((data: number) => {
            sum = sum + data;
        });
        expect(sum).to.eq(15);
    });

    it("must iterate filtered", function () {
        let stream = Stream.of<number>(...this.probe);
        let sum = 0;
        stream.filter((data) => data != 5).each((data) => {
            sum = sum + data;
        });
        expect(sum).to.eq(10);

        let stream2 = LazyStream.of<number>(...this.probe);
        sum = 0;
        stream2.filter((data) => data != 5).each((data: number) => {
            sum = sum + data;
        });
        expect(sum).to.eq(10);
    });


    it('must filter properly', function () {
        let probe0 = new LazyStream(new ArrayStreamDataSource(...[1, 2, 3, 4])).filter(item => {
            return item != null;
        }).collect(new ArrayCollector());

        expect(probe0.length).to.eq(4)
    })

    it("must stop at the first false", function () {
        let stream: Stream<number> | LazyStream<number> = LazyStream.of<number>(...this.probe);
        let callCnt = 0;
        stream.each(item => {
            callCnt++;
            return item < 3;
        })
        expect(callCnt).to.eq(3);

        stream = Stream.of<number>(...this.probe);
        callCnt = 0;
        stream.each(item => {
            callCnt++;
            return item < 3;
        })
        expect(callCnt).to.eq(3);

        stream = LazyStream.of<number>(...this.probe);
        callCnt = 0;
        stream
            .onElem(item => {
                callCnt++;
            })
            .each(item => {
                return item < 3;
            })
        expect(callCnt).to.eq(3);

        //special case early stream everything before foreach is handled in a separate step
        stream = Stream.of<number>(...this.probe);
        callCnt = 0;
        stream
            .onElem(item => {
                callCnt++;
            })
            .each(item => {
                return item < 3;
            })
        expect(callCnt).to.eq(5);
    })

    it("must onElem", function () {
        let stream = Stream.of<number>(...this.probe);
        let sum = 0;
        let sum2: number = stream.filter((data) => data != 5).onElem((data) => {
            sum = sum + data;
        }).reduce<number>((el1, el2) => el1 + el2).value;
        expect(sum).to.eq(10);
        expect(sum2).to.eq(10);

        let stream2 = LazyStream.of<number>(...this.probe);
        sum = 0;
        sum2 = stream2.filter((data) => data != 5).onElem((data: number) => {
            sum = sum + data;
        }).reduce((el1: number, el2: number) => el1 + el2).value;
        expect(sum).to.eq(10);
        expect(sum2).to.eq(10);
    })

    it("must have a correct first last", function () {
        let stream = Stream.of<number>(...this.probe);

        let first = Stream.of<number>(...this.probe).filter((data) => data != 5).onElem((data) => {
        }).first().value;
        let last = Stream.of<number>(...this.probe).filter((data) => data != 5).onElem((data) => {
        }).last().value;
        expect(first).to.eq(1);
        expect(last).to.eq(4);

    });

    it("must have a correct first last lazy", function () {
        let stream = LazyStream.of<number>(...this.probe);

        let first = LazyStream.of<number>(...this.probe).filter((data) => data != 5).onElem((data) => {
            data;
        }).first().value;
        let last = Stream.of<number>(...this.probe).filter((data) => data != 5).onElem((data) => {
            data;
        }).last().value;
        expect(first).to.eq(1);
        expect(last).to.eq(4);

    });

    it("must have a correct limits", function () {
        let cnt = 0;
        let last = Stream.of<number>(...this.probe).filter((data) => data != 5).limits(2).onElem((data) => {
            cnt++;
        }).last().value;

        expect(last).to.eq(2);
        expect(cnt).to.eq(2);

    });

    it("must initialize correctly from assoc array", function () {
        let probe = {
            key1: "val1",
            key2: 2,
            key3: "val3"
        }

        let arr1 = [];
        let arr2 = [];

        Stream.ofAssoc(probe).each(item => {
            expect(item.length).to.eq(2);
            arr1.push(item[0]);
            arr2.push(item[1]);
        });

        expect(arr1.join(",")).to.eq("key1,key2,key3");
        expect(arr2.join(",")).to.eq("val1,2,val3");

    });

    it("must have a correct lazy limits", function () {
        let last = LazyStream.of<number>(...this.probe).filter((data) => data != 5).limits(2).onElem((data) => {
            data;
        }).last().value;

        expect(last).to.eq(2);

    })

    it("must correctly lazily flatmap", function () {

        let resultingArr = LazyStream.of<number>(...this.probe).flatMap((data) => LazyStream.of(...[data, 2])).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly lazily flatmap with arrays", function () {

        let resultingArr = LazyStream.of<number>(...this.probe).flatMap((data) => [data, 2]).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly early flatmap", function () {

        let resultingArr = Stream.of<number>(...this.probe).flatMap((data) => Stream.of(...[data, 2])).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly early flatmap with arrays", function () {

        let resultingArr = Stream.of<number>(...this.probe).flatMap((data) => [data, 2]).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly flatmap intermixed", function () {

        let resultingArr = LazyStream.of<number>(...this.probe).flatMap((data) => Stream.of(...[data, 2])).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly flatmap intermixed2", function () {

        let resultingArr = Stream.of<number>(...this.probe).flatMap((data) => LazyStream.of(...[data, 2])).value;

        expect(resultingArr.length == 10).to.be.true;
        expect(resultingArr.join(",")).to.eq("1,2,2,2,3,2,4,2,5,2");
    });

    it("must correctly pass anyMatch allMatch noneMatch", function () {
        let anyMatch = LazyStream.of<number>(...this.probe).anyMatch((item) => item == 3);
        let allMatch = LazyStream.of<number>(...this.probe).allMatch((item) => item < 6);
        let noneMatch = LazyStream.of<number>(...this.probe).noneMatch((item) => item > 5);

        expect(anyMatch).to.be.true;
        expect(allMatch).to.be.true;
        expect(noneMatch).to.be.true;
    })

    it("must correctly pass anyMatch allMatch noneMatch early", function () {
        let anyMatch = Stream.of<number>(...this.probe).anyMatch((item) => item == 3);
        let allMatch = Stream.of<number>(...this.probe).allMatch((item) => item < 6);
        let noneMatch = Stream.of<number>(...this.probe).noneMatch((item) => item > 5);

        expect(anyMatch).to.be.true;
        expect(allMatch).to.be.true;
        expect(noneMatch).to.be.true;
    })

    it("must sort correctly", function () {

        let probe: Array<number> = [1, 5, 3, 2, 4];

        let res = Stream.of<number>(...probe)
            .sort((el1: number, el2: number) => el1 - el2)
            .collect(new ArrayCollector());

        expect(res.join(",")).to.eq("1,2,3,4,5");

    })

    it("must sort correctly lazy", function () {

        let probe: Array<number> = [1, 5, 3, 2, 4];

        let res = LazyStream.of<number>(...probe)
            .sort((el1: number, el2: number) => el1 - el2)
            .collect(new ArrayCollector());

        expect(res.join(",")).to.eq("1,2,3,4,5");

    })

    it("must handle a sequence of numbers correctly", function () {
        let datasource = new SequenceDataSource(0, 10);
        let res = LazyStream.ofStreamDataSource<number>(datasource)
            .collect(new ArrayCollector());
        expect(res.length == 10).to.be.true;
        expect(res[0] == 0).to.be.true;
        expect(res[9] == 9).to.be.true;
        expect(res[4] == 4).to.be.true;


    });

    it("must handle a reduced sequence of numbers correctly", function () {
        let datasource = new SequenceDataSource(1, 10);
        let res = LazyStream.ofStreamDataSource<number>(datasource)
            .collect(new ArrayCollector());
        expect(res.length == 9).to.be.true;
        expect(res[0] == 1).to.be.true;
        expect(res[8] == 9).to.be.true;
        expect(res[4] == 5).to.be.true;


    });

    it("must concat correctly", function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];
        let probe3: Array<number> = [11, 12, 13, 14, 15];
        let stream1 = Stream.of<number>(...probe);
        let stream2 = Stream.of<number>(...probe2);
        let stream3 = Stream.of<number>(...probe3);

        let finalStream = stream1.concat(stream2, stream3);

        expect(finalStream.collect(new ArrayCollector()).length).to.eq(15);
        expect(finalStream.collect(new ArrayCollector())[0]).to.eq(1);
        expect(finalStream.collect(new ArrayCollector())[14]).to.eq(15);
        expect(finalStream.collect(new ArrayCollector())[7]).to.eq(8);
    });

    it("must concat correctly lazily", function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];
        let probe3: Array<number> = [11, 12, 13, 14, 15];
        let stream1 = LazyStream.of<number>(...probe);
        let stream2 = LazyStream.of<number>(...probe2);
        let stream3 = LazyStream.of<number>(...probe3);

        let finalStream = stream1.concat(stream2, stream3);

        let retArr = finalStream.collect(new ArrayCollector());
        expect(retArr.length).to.eq(15);
        expect(retArr[0]).to.eq(1);
        expect(retArr[14]).to.eq(15);
        expect(retArr[7]).to.eq(8);
    });
    it("must work with rxjs and early streams", () => {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];

        let stream1 = Stream.of<number>(...probe).filter(item => {
            return item != 2;
        });
        let stream2 = Stream.of<number>(...probe2);


        let o1 = from(stream1);
        let o2 = from(stream2);


        let cnt1 = 0;
        let val1 = 0;
        o1.subscribe(value => {
            cnt1++;
            val1 = value;
        })
        //one item filtered
        expect(cnt1 == probe.length - 1).to.be.true;
        expect(val1).to.eq(5);


        let cnt2 = 0;
        let val2 = 0;
        o2.subscribe(value => {
            cnt2++;
            val2 = value;
        })

        expect(cnt2 == probe2.length).to.be.true;
        expect(val2).to.eq(10);
    });

    it("must work with rxjs and Lazy Streams", () => {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];

        let stream1 = LazyStream.of<number>(...probe).filter(item => {
            return item != 2;
        });
        ;
        let stream2 = LazyStream.of<number>(...probe2);

        let o1 = from(stream1);
        let o2 = from(stream2);


        let cnt1 = 0;
        let val1 = 0;
        o1.subscribe(value => {
            cnt1++;
            val1 = value;
        })

        expect(cnt1 == probe.length - 1).to.be.true;
        expect(val1).to.eq(5);

        let cnt2 = 0;
        let val2 = 0;
        o2.subscribe(value => {
            cnt2++;
            val2 = value;
        })

        expect(cnt2 == probe.length).to.be.true;
        expect(val2).to.eq(10);
    });

    it('it must concat with lazy streams', function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [1, 2, 3, 4, 5];

        let strm1 = LazyStream.of(...probe);
        let strm2 = LazyStream.of(...probe2);

        let strm3 = strm1.concat(strm2);
        let idx = {};
        //we now filter the doubles out
        const resultArr = strm3.filter(item => {
            const ret = !idx?.[`${item}`];
            return ret;
        })
            .map(item => {
                idx[`${item}`] = true;
                return item;
            })
            .collect(new ArrayCollector());
        expect(resultArr.length).to.eq(5);

    });

    it('streams must be recycleable after first usage', function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [1, 2, 3, 4, 5];

        let strm1 = LazyStream.of(...probe);
        let strm2 = LazyStream.of(...probe2);

        let strm3 = strm1.concat(strm2);

        let arr = strm3.filter(item => {
            return true;
        }).collect(new ArrayCollector())

        let idx = {};
        //we now filter the doubles out
        const resultArr = strm3.filter(item => {
            const ret = !idx?.[`${item}`];
            return ret;
        })
            .map(item => {
                idx[`${item}`] = true;
                return item;
            })
            .collect(new ArrayCollector());
        expect(resultArr.length).to.eq(5);

    })

    it('lazy streams must be recycleable after first usage', function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [1, 2, 3, 4, 5];

        let strm1 = LazyStream.of(...probe);
        let strm2 = LazyStream.of(...probe2);

        let strm3 = strm1.concat(strm2);

        let arr = strm3.filter(item => {
            return true;
        }).collect(new ArrayCollector())

        let idx = {};
        //we now filter the doubles out
        const resultArr = strm3.filter(item => {
            const ret = !idx?.[`${item}`];
            return ret;
        })
            .map(item => {
                idx[`${item}`] = true;
                return item;
            })
            .collect(new ArrayCollector());
        expect(resultArr.length).to.eq(5);

    })

    it('lazy streams must be handle complex look aheads', function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];
        let probe3: Array<number> = [11, 12, 13, 14, 15];
        let probe4: Array<number> = [16, 17, 18, 19, 20];

        let strm1 = LazyStream.of(...probe);
        let strm2 = LazyStream.of(...probe2);
        let strm3 = LazyStream.of(...probe3);
        let strm4 = LazyStream.of(...probe4);
        let strm5 = strm3.concat(strm4);

        let strm31 = strm1.concat(strm2).concat(strm5);
        strm31.each(item => console.log(item));
        //let res = strm31.lookAhead(8);
        global["debug"] = true;
        let res2 = strm31.lookAhead(15);
        let res3 = strm31.lookAhead(19);
        let res4 = strm31.lookAhead(21);
        //expect(res).to.eq(8);
        expect(res2).to.eq(15);
        expect(res3).to.eq(19);
        expect(res4).to.eq(ITERATION_STATUS.EO_STRM);
    });

    it('streams must be handle complex look aheads', function () {
        let probe: Array<number> = [1, 2, 3, 4, 5];
        let probe2: Array<number> = [6, 7, 8, 9, 10];
        let probe3: Array<number> = [11, 12, 13, 14, 15];
        let probe4: Array<number> = [16, 17, 18, 19, 20];

        let strm1 = Stream.of(...probe);
        let strm2 = Stream.of(...probe2);
        let strm3 = Stream.of(...probe3);
        let strm4 = Stream.of(...probe4);
        let strm5 = strm3.concat(strm4);

        let strm31 = strm1.concat(strm2).concat(strm5);
        strm31.each(item => console.log(item));
        //let res = strm31.lookAhead(8);
        global["debug"] = true;
        let res2 = strm31.lookAhead(15);
        let res3 = strm31.lookAhead(19);
        let res4 = strm31.lookAhead(21);
        //expect(res).to.eq(8);
        expect(res2).to.eq(15);
        expect(res3).to.eq(19);
        expect(res4).to.eq(ITERATION_STATUS.EO_STRM);
    });
});