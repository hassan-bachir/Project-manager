import { expect } from "chai";
import sinon from "sinon";
import { getOverview } from "../src/controllers/analyticsController.js";

describe("Analytics Controller – getOverview", () => {
  let fakeFastify;
  let reply;

  beforeEach(() => {
    // 1) Stub out prisma.task.count to return known values in sequence
    const countStub = sinon.stub();
    // total tasks → 10, completed → 4, overdue → 2
    countStub.onCall(0).resolves(10);
    countStub.onCall(1).resolves(4);
    countStub.onCall(2).resolves(2);

    fakeFastify = {
      prisma: { task: { count: countStub } },
    };

    // 2) Fake reply with a spy on .send()
    reply = { send: sinon.spy() };
  });

  it("calculates correct overview metrics", async () => {
    await getOverview(fakeFastify, {}, reply);

    // Ensure prisma.count was called three times
    expect(fakeFastify.prisma.task.count.callCount).to.equal(3);

    // capture the object passed to reply.send()
    const sent = reply.send.firstCall.args[0];
    expect(sent).to.deep.equal({
      total: 10,
      completed: 4,
      overdue: 2,
      completionRate: Math.round((4 / 10) * 100),
    });
  });
});
