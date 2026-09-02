// Aggregates every test module so `npm test` runs them all in one tsx process.
// Each module executes its assertions on import and logs its own summary.
import "./claims.test.mts";
import "./products.test.mts";
import "./partners.test.mts";
import "./kit.test.mts";
import "./posts.test.mts";
import "./jsonld.test.mts";
