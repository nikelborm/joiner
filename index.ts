import "@total-typescript/ts-reset";
import { _, joinTypeToEulerDiagramParts } from './constants';
import type {
  DetailingModifier,
  EulerDiagramPartsCombinations,
  Joiner,
  LRA,
  JoinType
} from './types';

export function join<
  const EulerDiagramParts extends EulerDiagramPartsCombinations,
  L,
  R,
  MergedResult,
  const Detailing extends DetailingModifier = 'A',
  TupleType = Joiner<L, R, EulerDiagramParts, Detailing>,
>(
  left: Iterable<L>,
  right: Iterable<R>,
  joinType: Exclude<JoinType, 'crossJoin'>,
  merge: (tuple: TupleType) => MergedResult,
  passesJoinCondition: (tuple: LRA<L, R>) => boolean,
): Generator<TupleType>;

export function join<
  const EulerDiagramParts extends EulerDiagramPartsCombinations,
  L,
  R,
  MergedResult,
  const Detailing extends DetailingModifier = 'A',
  TupleType = Joiner<L, R, EulerDiagramParts, Detailing>,
>(
  left: Iterable<L>,
  right: Iterable<R>,
  joinType: 'crossJoin',
  merge: (tuple: TupleType) => MergedResult,
): Generator<TupleType>;

export function join<
  const InferredJoinType extends JoinType,
  L,
  R,
  MergedResult,
  EulerDiagramParts extends EulerDiagramPartsCombinations
    = typeof joinTypeToEulerDiagramParts[InferredJoinType],
  const Detailing extends DetailingModifier = 'A',
  TupleType = Joiner<L, R, EulerDiagramParts, Detailing>,
>(
  left: Iterable<L>,
  right: Iterable<R>,
  joinType: InferredJoinType,
  merge: (tuple: TupleType) => MergedResult,
  passesJoinCondition?: (tuple: LRA<L, R>) => boolean,
) {
  if (joinType === 'crossJoin' && passesJoinCondition !== undefined)
    throw new Error();

  if (joinType !== 'crossJoin' && passesJoinCondition === undefined)
    throw new Error();

  return joinGeneratorOnEulerDiagramParts(
    left,
    right,
    joinTypeToEulerDiagramParts[joinType],
    merge,
    joinType === 'crossJoin'
      ? () => true
      : passesJoinCondition as (tuple: LRA<L, R>) => boolean,
    'A'
  );
}

export function * joinGeneratorOnEulerDiagramParts<
  const EulerDiagramParts extends EulerDiagramPartsCombinations,
  L,
  R,
  MergedResult,
  const Detailing extends DetailingModifier = 'A',
  TupleType = Joiner<L, R, EulerDiagramParts, Detailing>,
>(
  left: Iterable<L>,
  right: Iterable<R>,
  eulerDiagramParts: EulerDiagramParts,
  merge: (tuple: TupleType) => MergedResult,
  passesJoinCondition: (tuple: LRA<L, R>) => boolean,
  // used to infer param for type system. Do not remove
  detailingModifier: Detailing = 'A' as Detailing
) {
  const bits = parseInt(eulerDiagramParts, 2);
  const shouldAddLeftExclusivePart  = bits & 0b100;
  const shouldAddInnerPart          = bits & 0b010;
  const shouldAddRightExclusivePart = bits & 0b001;
  let ref = {} as { unmatchedRightIndexes: Set<number> };

  if(shouldAddRightExclusivePart)
    ref.unmatchedRightIndexes = new Set(
      Array.from(right, (e, i) => i)
    );

  for (const l of left) {
    let lNeverPassedJoinCondition = true;
    let rIndex = -1;
    // Starts with -1 because is being incremented before used

    for (const r of right) {
      const tuple = [l, r] satisfies LRA<L, R>;
      rIndex++;
      if (!passesJoinCondition(tuple)) continue;
      lNeverPassedJoinCondition = false;

      if(shouldAddRightExclusivePart)
        ref.unmatchedRightIndexes.delete(rIndex);

      if(shouldAddInnerPart)
        yield merge(tuple as TupleType);
    }

    if(
      lNeverPassedJoinCondition
      && shouldAddLeftExclusivePart
    )
      yield merge([l, _] as TupleType);
  }

  if(shouldAddRightExclusivePart) {
    let rIndex = 0;

    for (const r of right) {
      if(ref.unmatchedRightIndexes.has(rIndex++))
        yield merge([_, r] as TupleType);
    }
  }
}

const brandA = Symbol('A');
const brandB = Symbol('B');

type A1 = { brand: typeof brandA; id: number; v: number; };
type B1 = { brand: typeof brandB; id: number; v: number; };


for (const iterator of joinGeneratorOnEulerDiagramParts(
  new Set<A1>([
    { brand: brandA, id: 1, v: 6 },
    { brand: brandA, id: 2, v: 6 },
    { brand: brandA, id: 3, v: 7 },
    { brand: brandA, id: 4, v: 7 },
    { brand: brandA, id: 5, v: 9 }
  ]),
  new Set<B1>([
    { brand: brandB, id: 1, v: 7  },
    { brand: brandB, id: 2, v: 7  },
    { brand: brandB, id: 3, v: 8  },
    { brand: brandB, id: 4, v: 8  },
    { brand: brandB, id: 5, v: 10 }
  ]),
  '101',
  (tuple) => tuple[0] === _ ? tuple[1] : tuple[0],
  (tuple) => tuple[0].v === tuple[1].v,
  'E'
)) {

}
