
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }

    getRoot() {
        return this.getChildRoot(this.leaves)
    }

    getChildRoot(leaves) {
        if (leaves.length < 2) {
            return leaves;
        } else if(leaves.length == 2) {
            return this.concat(leaves[0], leaves[1]);
        } else {
            let newLeaves = [];

            for(let i = 0; i < leaves.length - 1; i=i+2) {
                newLeaves.push(this.concat(leaves[i], leaves[i+1]));
            }

            if(leaves.length % 2 == 1) {
                newLeaves.push(leaves[leaves.length - 1])
            }

            return this.getChildRoot(newLeaves)
        }
    }

    getProof(index) {
        this.formulas = [];
        return this.getChildProof(this.leaves, this.leaves.map((leaf) => leaf.toString('hex')), this.leaves[index].toString('hex'));
    }

    isFormulaIncluded(leaves) {
        let isIncluded = false;

        this.formulas.map((formula) => {
            leaves.map((leave) => {
                if(formula.convertedData.includes(leave)) {
                    isIncluded = true
                }
            })
        })

        return isIncluded;
    }

    getChildProof(leaves, convertedLeaves, leafToProof) {
        if (leaves.length < 2) {
            this.formulas = this.formulas.map((formula) => {
                return {
                    data: formula.data,
                    left: formula.left
                }
            });
            return this.formulas;
        } else if(leaves.length == 2) {
            if(convertedLeaves[0].includes(leafToProof) && !this.isFormulaIncluded(convertedLeaves[1].toString().split('+'))) {
                this.formulas.push({
                    convertedData: convertedLeaves[1],
                    data: leaves[1],
                    left: false
                })
            } else if(convertedLeaves[1].includes(leafToProof) && !this.isFormulaIncluded(convertedLeaves[0].toString().split('+'))) {
                 this.formulas.push({
                    convertedData: convertedLeaves[0],
                    data: leaves[0],
                    left: true
                })
            }
            
            this.formulas = this.formulas.map((formula) => {
                return {
                    data: formula.data,
                    left: formula.left
                }
            });
            return this.formulas;
        } else {
            let newLeaves = [];
            let newConvertedLeaves = [];

            for(let i = 0; i < leaves.length - 1; i=i+2) {
                newLeaves.push(this.concat(leaves[i], leaves[i+1]));
                newConvertedLeaves.push(`${convertedLeaves[i]}+${convertedLeaves[i+1]}`);

                if(convertedLeaves[i].includes(leafToProof) && !this.isFormulaIncluded(convertedLeaves[i+1].toString().split('+'))) {
                    this.formulas.push({
                        convertedData: convertedLeaves[i+1],
                        data: leaves[i+1],
                        left: false
                    })
                } else if(convertedLeaves[i+1].includes(leafToProof) && !this.isFormulaIncluded(convertedLeaves[i].toString().split('+'))) {
                     this.formulas.push({
                        convertedData: convertedLeaves[i],
                        data: leaves[i],
                        left: true
                    })
                }
            }

            if(leaves.length % 2 == 1) {
                newLeaves.push(leaves[leaves.length - 1]);
                newConvertedLeaves.push(convertedLeaves[convertedLeaves.length - 1])
            }

            return this.getChildProof(newLeaves, newConvertedLeaves, leafToProof)
        }
    }
}

module.exports = MerkleTree;