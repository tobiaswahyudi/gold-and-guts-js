class MinHeap<T, K extends keyof T> {
    private heap: T[] = [];
    private key: K;

    constructor(key: K) {
        this.heap = [];
        this.key = key;
    }

    private parent(i: number): number {
        return (i - 1) >> 1;
    }

    private leftChild(i: number): number {
        return (i << 1) + 1;
    }

    private rightChild(i: number): number {
        return (i + 1) << 1;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    private heapifyUp(index: number): void {
        while (index > 0) {
            const parentIndex = this.parent(index);
            if (
                this.heap[parentIndex][this.key] <= this.heap[index][this.key]
            ) {
                break;
            }
            this.swap(parentIndex, index);
            index = parentIndex;
        }
    }

    private heapifyDown(index: number): void {
        while (this.leftChild(index) < this.heap.length) {
            let minChildIndex = this.leftChild(index);
            const rightIndex = this.rightChild(index);

            if (
                rightIndex < this.heap.length &&
                this.heap[rightIndex][this.key] <
                    this.heap[minChildIndex][this.key]
            ) {
                minChildIndex = rightIndex;
            }

            if (
                this.heap[index][this.key] <= this.heap[minChildIndex][this.key]
            ) {
                break;
            }

            this.swap(index, minChildIndex);
            index = minChildIndex;
        }
    }

    push(item: T): void {
        this.heap.push(item);
        this.heapifyUp(this.heap.length - 1);
    }

    pop(): T {
        // go down like kings
        // if (this.heap.length === 0) {
        //     return undefined;
        // }

        if (this.heap.length === 1) {
            return this.heap.pop()!;
        }

        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);
        return min;
    }

    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}

export default MinHeap;
