export class QuadTreeNode {
  boundary: { x: number; y: number; width: number; height: number };
  capacity: number;
  points: Array<{ id: number; x: number; y: number; data: any }>;
  divided: boolean;
  northeast: QuadTreeNode | null;
  northwest: QuadTreeNode | null;
  southeast: QuadTreeNode | null;
  southwest: QuadTreeNode | null;

  constructor(
    boundary: { x: number; y: number; width: number; height: number },
    capacity = 4
  ) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.northeast = null;
    this.northwest = null;
    this.southeast = null;
    this.southwest = null;
  }

  subdivide() {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.width / 2;
    const h = this.boundary.height / 2;

    const ne = { x: x + w, y: y - h, width: w, height: h };
    const nw = { x: x - w, y: y - h, width: w, height: h };
    const se = { x: x + w, y: y + h, width: w, height: h };
    const sw = { x: x - w, y: y + h, width: w, height: h };

    this.northeast = new QuadTreeNode(ne, this.capacity);
    this.northwest = new QuadTreeNode(nw, this.capacity);
    this.southeast = new QuadTreeNode(se, this.capacity);
    this.southwest = new QuadTreeNode(sw, this.capacity);

    this.divided = true;
  }

  insert(point: { id: number; x: number; y: number; data: any }): boolean {
    if (!this.contains(point)) {
      return false;
    }

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) {
      this.subdivide();
    }

    return (
      this.northeast!.insert(point) ||
      this.northwest!.insert(point) ||
      this.southeast!.insert(point) ||
      this.southwest!.insert(point)
    );
  }

  contains(point: { x: number; y: number }): boolean {
    return (
      point.x >= this.boundary.x - this.boundary.width &&
      point.x <= this.boundary.x + this.boundary.width &&
      point.y >= this.boundary.y - this.boundary.height &&
      point.y <= this.boundary.y + this.boundary.height
    );
  }

  query(
    range: { x: number; y: number; width: number; height: number },
    found: Array<any> = []
  ): Array<any> {
    if (!this.intersects(range)) {
      return found;
    }

    for (const point of this.points) {
      if (
        point.x >= range.x - range.width &&
        point.x <= range.x + range.width &&
        point.y >= range.y - range.height &&
        point.y <= range.y + range.height
      ) {
        found.push(point);
      }
    }

    if (this.divided) {
      this.northeast!.query(range, found);
      this.northwest!.query(range, found);
      this.southeast!.query(range, found);
      this.southwest!.query(range, found);
    }

    return found;
  }

  intersects(range: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): boolean {
    return !(
      range.x - range.width > this.boundary.x + this.boundary.width ||
      range.x + range.width < this.boundary.x - this.boundary.width ||
      range.y - range.height > this.boundary.y + this.boundary.height ||
      range.y + range.height < this.boundary.y - this.boundary.height
    );
  }
}

export const createWorldQuadTree = () => {
  const worldBoundary = { x: 0, y: 0, width: 180, height: 90 };
  return new QuadTreeNode(worldBoundary);
};
