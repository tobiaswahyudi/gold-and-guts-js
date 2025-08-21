import MinHeap from "../utils/pq";

const makeCell = (x: number, y: number) => ({
    x,
    y,
    to: [] as [number, number][],
    cost: 0,
    weight: 1,
});

type Cell = ReturnType<typeof makeCell>;

type Track = {
    x: number;
    y: number;
    from: [number, number];
    cost: number;
};

const makeVisitedArray = (size: number) =>
    new Array(size).fill(0).map((_, i) => new Array(size).fill(false));

const CARDINALS = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
];

const DIAGONALS = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];

// punching a diamond wall
const SQRT_2 = Math.sqrt(2);
const EPSILON = 1e-6;

const ADJACENTS = [
    ...CARDINALS.map((v) => [...v, 1]),
    ...DIAGONALS.map((v) => [...v, SQRT_2]),
];


export class PathGrid {
    grid: Cell[][];
    private base: [number, number];
    private size: number;

    constructor(size: number, base: [number, number]) {
        this.grid = new Array(size)
            .fill(0)
            .map((_, i) =>
                new Array(size).fill(0).map((_, j) => makeCell(i, j))
            );
        this.base = base;
        this.size = size;
    }

    inBounds(x: number, y: number) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    recompute() {
        const pq = new MinHeap<Track, "cost">("cost");
        const visited = makeVisitedArray(this.size);

        pq.push({
            x: this.base[0],
            y: this.base[1],
            from: [-1, -1],
            cost: 0,
        });
        visited[this.base[0]][this.base[1]] = true;

        while (!pq.isEmpty()) {
            const { x, y, from, cost } = pq.pop();
            if (visited[x][y]) continue;
            visited[x][y] = true;
            this.grid[x][y].cost = cost;
            this.grid[x][y].to.push(from);

            if (x === this.base[0] && y === this.base[1]) {
                return from;
            }

            for (const [dx, dy, dist] of ADJACENTS) {
                const nx = x + dx;
                const ny = y + dy;
                if (!this.inBounds(nx, ny)) continue;

                const weight = this.grid[nx][ny].weight * dist;
                const newCost = cost + weight;

                if (visited[nx][ny]) {
                    if (this.grid[nx][ny].cost <= newCost + EPSILON) {
                        // also track this cell as a next path
                        this.grid[nx][ny].to.push([x, y]);
                    }
                } else {
                    pq.push({ x: nx, y: ny, from: [x, y], cost: newCost });
                }
            }
        }
    }
}
