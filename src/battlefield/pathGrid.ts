import MinHeap from "../utils/pq";
import { BattlefieldConfig } from "./types";

export class Cell {
    x: number;
    y: number;
    i: number;
    j: number;
    to: Cell[];
    cost: number;
    weight: number;
    blocked: boolean;

    constructor(x: number, y: number, i: number, j: number) {
        this.x = x;
        this.y = y;
        this.i = i;
        this.j = j;
        this.to = [];
        this.cost = 0;
        this.weight = 1;
        this.blocked = false;
    }

    get next() {
        return this.to[Math.floor(Math.random() * this.to.length)];
    }
}

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
    base: [number, number];
    size: number;
    squareSize: number;
    resetPoint: [number, number];
    blocked: Set<[number, number]>;

    constructor(config: BattlefieldConfig) {
        this.grid = new Array(config.gridSize)
            .fill(0)
            .map((_, i) =>
                new Array(config.gridSize)
                    .fill(0)
                    .map(
                        (_, j) =>
                            new Cell(
                                (j + 0.5) * config.squareSize + config.x,
                                (i + 0.5) * config.squareSize + config.y,
                                i,
                                j
                            )
                    )
            );
        this.base = config.base;
        this.size = config.gridSize;
        this.squareSize = config.squareSize;
        this.resetPoint = config.spawnPoints[0];
        this.blocked = new Set();
    }

    inBounds(x: number, y: number) {
        return x >= 0 && x < this.size && y >= 0 && y < this.size;
    }

    blockCell(x: number, y: number) {
        this.grid[y][x].blocked = true;

        for (const [dx, dy] of ADJACENTS) {
            const nx = x + dx;
            const ny = y + dy;
            if (this.inBounds(nx, ny)) {
                this.grid[ny][nx].weight *= 1.5;
            }
        }

        this.blocked.add([y, x]);

        this.recompute();
    }

    recompute() {
        // console.log("recomputing");

        this.grid.forEach((row) => {
            row.forEach((cell) => {
                cell.to = [];
                cell.cost = 99999;
            });
        });

        const pq = new MinHeap<Track, "cost">("cost");
        const visited = makeVisitedArray(this.size);

        this.blocked.forEach(([x, y]) => {
            visited[x][y] = true;
        });

        pq.push({
            x: this.base[0],
            y: this.base[1],
            from: this.resetPoint,
            cost: 0,
        });

        while (!pq.isEmpty()) {
            const {
                x,
                y,
                from: [fx, fy],
                cost,
            } = pq.pop();
            if (this.grid[x][y].blocked) {
                visited[x][y] = true;
                continue;
            }
            if (visited[x][y]) {
                if (this.grid[x][y].cost + EPSILON >= cost) {
                    // also track this cell as a next path
                    this.grid[x][y].to.push(this.grid[fx][fy]);
                }
                continue;
            }
            visited[x][y] = true;
            this.grid[x][y].cost = cost;
            this.grid[x][y].to.push(this.grid[fx][fy]);

            for (const [dx, dy, dist] of ADJACENTS) {
                const nx = x + dx;
                const ny = y + dy;
                if (!this.inBounds(nx, ny)) continue;

                const weight = this.grid[nx][ny].weight * dist;
                const newCost = cost + weight;

                if (this.grid[nx][ny].blocked) {
                    visited[nx][ny] = true;
                    continue;
                } else if (visited[nx][ny]) {
                    if (this.grid[nx][ny].cost + EPSILON >= newCost) {
                        // also track this cell as a next path
                        this.grid[nx][ny].to.push(this.grid[x][y]);
                    }
                } else {
                    pq.push({ x: nx, y: ny, from: [x, y], cost: newCost });
                }
            }
        }
    }
}
