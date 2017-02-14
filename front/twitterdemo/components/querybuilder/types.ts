export type QExprs = {
  [index: number]: QExpr;
}
export type QExpr = {
  $and?: QExprs;
  $or?: QExprs;
  $not? : QExpr;
  $exact?: QExpr;
  $to?: QExpr;
  $from?: QExpr;
  $pos?: QExpr;
  $neg?: QExpr;
  $q?: QExpr;
  $mention?: QExpr;
} | string;

export type AndTree = {
  [index: number]: QExpr;
}

export type OrTree = {
  [index: number]: AndTree;
};

