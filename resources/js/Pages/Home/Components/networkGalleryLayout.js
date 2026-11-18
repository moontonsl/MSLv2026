// Curved "photo wall" layout for the Home MSL Network gallery.
//
// Tiles sit on the inside of a cylinder that wraps toward the viewer: the centre
// column is farthest away (smallest) and the edge columns come forward (largest),
// like a panoramic photo-gallery wall. Each tile is placed with a real CSS 3D
// transform: translateZ(R) rotateY(angle) translateZ(-R), inside a container that
// has `perspective: P`.

const GAP = 4; // px between tiles, kept tight like a photo wall
const ARC = 110; // total arc (degrees) the wall wraps across
const PERSPECTIVE_RATIO = 1.5; // perspective distance as a multiple of the radius
const MIN_TILE = 130; // available width per column (≈11 columns on a full-width 1440px wall)
const TILE_ASPECT = 0.72; // tile height / width (landscape)
const MIN_COLUMNS = 4;
const MAX_COLUMNS = 14;
const MAX_ROWS = 5; // keep the wall short like a panoramic photo wall

const toRadians = (degrees) => (degrees * Math.PI) / 180;

export function getNetworkGalleryLayout(count, availableWidth) {
    if (!count || availableWidth < 640) return null;

    const columns = Math.min(
        count,
        MAX_COLUMNS,
        Math.max(MIN_COLUMNS, Math.floor(availableWidth / MIN_TILE), Math.ceil(count / MAX_ROWS)),
    );
    const arc = toRadians(ARC) * Math.min(1, columns / MIN_COLUMNS);
    const step = arc / columns;
    const halfArc = arc / 2;

    // Projected half-width of the wall for radius 1; everything scales linearly with R.
    const k = PERSPECTIVE_RATIO;
    const edgeDepth = 1 - Math.cos(halfArc);
    const projectedHalfWidth = (Math.sin(halfArc) * k) / (k - edgeDepth);
    const radius = (availableWidth / 2 - 2) / projectedHalfWidth;
    const perspective = radius * k;

    const tileWidth = 2 * radius * Math.sin(step / 2) - GAP;
    const tileHeight = tileWidth * TILE_ASPECT;
    const rows = Math.ceil(count / columns);
    const blockHeight = rows * tileHeight + (rows - 1) * GAP;

    // Edge tiles are closer to the viewer, so the wall's corners grow by this factor.
    const edgeScale = k / (k - edgeDepth);
    const verticalPadding = (blockHeight * (edgeScale - 1)) / 2 + 8;
    const reflectionSpace = tileHeight * 0.9;

    const tiles = Array.from({ length: count }, (_, index) => {
        const row = Math.floor(index / columns);
        const rowStart = row * columns;
        const rowLength = Math.min(columns, count - rowStart);
        const column = index - rowStart;
        // Left columns get a positive angle (they sit to the left of centre).
        const angle = (step * ((rowLength - 1) / 2 - column) * 180) / Math.PI;

        return {
            angle,
            top: verticalPadding + row * (tileHeight + GAP),
            reflection: row === rows - 1,
        };
    });

    return {
        tiles,
        radius,
        perspective,
        tileWidth,
        tileHeight,
        height: blockHeight + verticalPadding * 2 + reflectionSpace,
        originY: verticalPadding + blockHeight / 2,
    };
}
