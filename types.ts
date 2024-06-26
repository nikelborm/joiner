import type { _, joinTypeToEulerDiagramParts } from './constants';

export type _ = typeof _;

export type Merge<T> = { [P in keyof T]: T[P] } & {};
export type UnSet<T> = T extends Set<infer U> ? U : never;

// it's intentionally [Something] extends ['___'] so that if union of Something
// is passed, generic won't ignore all elements except the first element of the
// union. Generic will reject the whole union and throw error
export type ForbiddenLiteralUnion<
  Argument extends string,
  OfTypeName extends string
> =
  `Argument ${Argument} of ${
    OfTypeName
  }<...> accepts only single string literal (literal union is forbidden).`
;

// 3rd letter
export type DetailingModifier = 'A' | 'C' | 'E';
// A - Atomic. Union of narrowest LR tuple types. Narrowest means that
// elements of the LR tuple are not unions and either _ or value (L or R,
// depending on the position)
// C - Compacted. The most high order representation of the combination
// of atoms.
// E - Expanded. Union of all possible representations of compacted tuple

// 1st letter:
export type LeftTupleStructureCodePart = 'N' | 'L' | 'B';
// N - No element(empty/_). 1st element of the tuple is _
// L - Left element(L)    . 1st element of the tuple is L
// B - Both               . 1st element of the tuple is (_ | L)

// 2nd letter:
export type RightTupleStructureCodePart = 'N' | 'R' | 'B';
// N - No element(empty/_). 2nd element of the tuple is _
// R - Right element(R)   . 2nd element of the tuple is R
// B - Both               . 2nd element of the tuple is (_ | R)



// ATOMS
export type LNA<L, R> = [L, _];
export type NRA<L, R> = [_, R];
export type LRA<L, R> = [L, R];

// To better understand atoms with letter B in code, see according compacted
export type LBA<L, R> = LNA<L, R> | LRA<L, R>;
export type BRA<L, R> = NRA<L, R> | LRA<L, R>;
export type BBA<L, R> = LNA<L, R> | NRA<L, R> | LRA<L, R>;

// COMPACTED
export type LNC<L, R> = LNA<L, R>;
export type NRC<L, R> = NRA<L, R>;
export type LRC<L, R> = LRA<L, R>;

export type LBC<L, R> = [L    , R | _];
export type BRC<L, R> = [L | _, R    ];
export type BBC<L, R> = LBC<L, R> | BRC<L, R>;

// EXPANDED
export type LNE<L, R> = LNA<L, R>;
export type NRE<L, R> = NRA<L, R>;
export type LRE<L, R> = LRA<L, R>;

export type LBE<L, R> = LBA<L, R> | LBC<L, R>;
export type BRE<L, R> = BRA<L, R> | BRC<L, R>;
export type BBE<L, R> = BBA<L, R> | BBC<L, R>;







export type FilterOne<
  Tuple extends [any, any],
  Pos extends 0 | 1
> = [Tuple[Pos]] extends [never] ? never : Tuple;



export type Filter<
  Tuple extends [any, any],
  By extends 'l-' | '-r' | 'lr'
> =
  [By] extends ['l-'] ? FilterOne<Tuple, 0> :
  [By] extends ['-r'] ? FilterOne<Tuple, 1> :
  [By] extends ['lr'] ? FilterOne<FilterOne<Tuple, 0>, 1> :
  ForbiddenLiteralUnion<'By', 'Filter<Tuple, By>'>
;

export type to_<T> = Extract<T, _>;
export type toV<T> = Exclude<T, _>;

// ATOMS
export type toLNA<L, R> = Filter<[toV<L>, to_<R>], 'lr'>; // [L, _];
export type toNRA<L, R> = Filter<[to_<L>, toV<R>], 'lr'>; // [_, R];
export type toLRA<L, R> = Filter<[toV<L>, toV<R>], 'lr'>; // [L, R];

// To better understand atoms with letter B in code, see according compact
export type toLBA<L, R> = toLNA<L, R> | toLRA<L, R>;
export type toBRA<L, R> = toNRA<L, R> | toLRA<L, R>;
export type toBBA<L, R> = toLNA<L, R> | toNRA<L, R> | toLRA<L, R>;

// COMPACTED
export type toLNC<L, R> = toLNA<L, R>;
export type toNRC<L, R> = toNRA<L, R>;
export type toLRC<L, R> = toLRA<L, R>;

export type toLBC<L, R> = Filter<[toV<L>, R     ], 'l-'>; // [L    , R | _];
export type toBRC<L, R> = Filter<[L     , toV<R>], '-r'>; // [L | _, R    ];
export type toBBC<L, R> = toLBC<L, R> | toBRC<L, R>

// EXPANDED
export type toLNE<L, R> = toLNA<L, R>;
export type toNRE<L, R> = toNRA<L, R>;
export type toLRE<L, R> = toLRA<L, R>;

export type toLBE<L, R> = toLBA<L, R> | toLBC<L, R>;
export type toBRE<L, R> = toBRA<L, R> | toBRC<L, R>;
export type toBBE<L, R> = toBBA<L, R> | toBBC<L, R>;










export type ShouldAddLeftExclusivePart = '0' | '1';
export type ShouldAddInnerPart = '0' | '1';
export type ShouldAddRightExclusivePart = '0' | '1';

export type EulerDiagramPartsCombinations =
  Exclude<`${
    ShouldAddLeftExclusivePart
  }${
    ShouldAddInnerPart
  }${
    ShouldAddRightExclusivePart
  }`, '000'>
;



export type TupleStructureCodeBy<
  EulerDiagramParts extends EulerDiagramPartsCombinations
> =
  [EulerDiagramParts] extends ['001'] ? 'NR' : // right join excluding inner
  [EulerDiagramParts] extends ['010'] ? 'LR' : // inner join
  [EulerDiagramParts] extends ['011'] ? 'BR' : // right outer join (right join)
  [EulerDiagramParts] extends ['100'] ? 'LN' : // left join excluding inner
  [EulerDiagramParts] extends ['101'] ? 'LN' | 'NR' : // full outer join excluding inner
  [EulerDiagramParts] extends ['110'] ? 'LB' : // left outer join (left join)
  [EulerDiagramParts] extends ['111'] ? 'BB' : // full outer join (full join)
  ForbiddenLiteralUnion<'EulerDiagramParts', 'TupleStructureCodeBy'>
;

export type TupleStructureCodeAcceptingUnionBy<
  EulerDiagramPartsUnion extends EulerDiagramPartsCombinations
> =
  {
    '001': 'NR';
    '010': 'LR';
    '011': 'BR';
    '100': 'LN';
    '101': 'LN' | 'NR';
    '110': 'LB';
    '111': 'BB';
  }[EulerDiagramPartsUnion]
;

export type TupleStructureCode = Exclude<
  `${LeftTupleStructureCodePart}${RightTupleStructureCodePart}`,
  'NN' | 'NB' | 'BN'
>;

export type TupleStructureCodeToDetailingModifierCombinations =
  `${TupleStructureCode}${DetailingModifier}`;


export type SelectJoinedTuples<
  L,
  R,
  Comb extends TupleStructureCodeToDetailingModifierCombinations
> =
  [Comb] extends ['LNA'] ? LNA<L, R> :
  [Comb] extends ['NRA'] ? NRA<L, R> :
  [Comb] extends ['LRA'] ? LRA<L, R> :
  [Comb] extends ['LBA'] ? LBA<L, R> :
  [Comb] extends ['BRA'] ? BRA<L, R> :
  [Comb] extends ['BBA'] ? BBA<L, R> :
  [Comb] extends ['LNC'] ? LNC<L, R> :
  [Comb] extends ['NRC'] ? NRC<L, R> :
  [Comb] extends ['LRC'] ? LRC<L, R> :
  [Comb] extends ['LBC'] ? LBC<L, R> :
  [Comb] extends ['BRC'] ? BRC<L, R> :
  [Comb] extends ['BBC'] ? BBC<L, R> :
  [Comb] extends ['LNE'] ? LNE<L, R> :
  [Comb] extends ['NRE'] ? NRE<L, R> :
  [Comb] extends ['LRE'] ? LRE<L, R> :
  [Comb] extends ['LBE'] ? LBE<L, R> :
  [Comb] extends ['BRE'] ? BRE<L, R> :
  [Comb] extends ['BBE'] ? BBE<L, R> :
  ForbiddenLiteralUnion<'Comb', 'SelectJoinedTuples'>
;

export type SelectJoinedTuplesAcceptUnion<
  L,
  R,
  CombUnion extends TupleStructureCodeToDetailingModifierCombinations
> = {
  'LNA': LNA<L, R>;
  'NRA': NRA<L, R>;
  'LRA': LRA<L, R>;
  'LBA': LBA<L, R>;
  'BRA': BRA<L, R>;
  'BBA': BBA<L, R>;
  'LNC': LNC<L, R>;
  'NRC': NRC<L, R>;
  'LRC': LRC<L, R>;
  'LBC': LBC<L, R>;
  'BRC': BRC<L, R>;
  'BBC': BBC<L, R>;
  'LNE': LNE<L, R>;
  'NRE': NRE<L, R>;
  'LRE': LRE<L, R>;
  'LBE': LBE<L, R>;
  'BRE': BRE<L, R>;
  'BBE': BBE<L, R>;
}[CombUnion];



export type Joiner<
  L,
  R,
  EulerDiagramParts extends EulerDiagramPartsCombinations,
  Detailing extends DetailingModifier,
> =
  TupleStructureCodeBy<EulerDiagramParts> extends TupleStructureCode
    ? Merge<SelectJoinedTuplesAcceptUnion<
      L,
      R,
      `${TupleStructureCodeBy<EulerDiagramParts>}${Detailing}`
    >>
    : ForbiddenLiteralUnion<'EulerDiagramParts', 'Joiner'>
;



export type LeftExclusiveJoin <L, R> = Joiner<L, R, '100', 'E'>;
export type InnerJoin         <L, R> = Joiner<L, R, '010', 'E'>;
export type RightExclusiveJoin<L, R> = Joiner<L, R, '001', 'E'>;
export type LeftJoin          <L, R> = Joiner<L, R, '110', 'E'>;
export type RightJoin         <L, R> = Joiner<L, R, '011', 'E'>;
export type FullJoin          <L, R> = Joiner<L, R, '111', 'E'>;
export type FullExclusiveJoin <L, R> = Joiner<L, R, '101', 'E'>;

export type LeftOuterJoin <L, R> = LeftJoin<L, R>;
export type RightOuterJoin<L, R> = RightJoin<L, R>;
export type FullOuterJoin <L, R> = FullJoin<L, R>;
export type LeftAntiJoin  <L, R> = LeftExclusiveJoin<L, R>;
export type RightAntiJoin <L, R> = RightExclusiveJoin<L, R>;
export type FullAntiJoin  <L, R> = FullExclusiveJoin<L, R>;
export type Join          <L, R> = InnerJoin<L, R>;
export type SimpleJoin    <L, R> = InnerJoin<L, R>;
export type CrossJoin     <L, R> = InnerJoin<L, R>;

export type JoinType = keyof typeof joinTypeToEulerDiagramParts;
