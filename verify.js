function verifyProof(proof, node, root, concat) {
  proof.map((formula) => {
    if (formula.left) {
      node = concat(formula.data, node);
    } else {
      node = concat(node, formula.data);
    }
  });

  return node === root;
}

module.exports = verifyProof;
