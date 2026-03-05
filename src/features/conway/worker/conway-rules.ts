import type { CellState, ComputeStrategy, WorkerInput } from "./conway-types";
import { computeNextStateNested } from "./conway-strategy-nested";
import { computeNextStateLinearAlgebra } from "./conway-strategy-linear-algebra";
import { computeNextStateGraph } from "./conway-strategy-graph";
import { computeNextStateCachedLinearAlgebra } from "./conway-strategy-cached-linear-algebra";
import { computeNextStateExplicitTopology } from "./conway-strategy-explicit-topology";

export type { CellState, ComputeStrategy, WorkerInput, TopologyMap, GridDimensions } from "./conway-types";
export { idToKey, getCellCount } from "./conway-grid";

export { computeNextStateNested } from "./conway-strategy-nested";
export { computeNextStateLinearAlgebra } from "./conway-strategy-linear-algebra";
export { computeNextStateGraph } from "./conway-strategy-graph";
export { computeNextStateCachedLinearAlgebra } from "./conway-strategy-cached-linear-algebra";
export { computeNextStateExplicitTopology } from "./conway-strategy-explicit-topology";

export function computeNextState(input: WorkerInput): CellState[] {
  const strategy = input.strategy ?? "nested";
  if (strategy === "linear-algebra") return computeNextStateLinearAlgebra(input);
  if (strategy === "graph") return computeNextStateGraph(input);
  if (strategy === "cached-linear-algebra")
    return computeNextStateCachedLinearAlgebra(input);
  if (strategy === "explicit-topology")
    return computeNextStateExplicitTopology(input);
  return computeNextStateNested(input);
}
