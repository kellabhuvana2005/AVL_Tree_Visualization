class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

let root = null;
let highlight = null;

function height(n) {
  return n ? n.height : 0;
}

function getBalance(n) {
  return n ? height(n.left) - height(n.right) : 0;
}

function rightRotate(y) {
  document.getElementById("rotationInfo").innerText = "LL Rotation";
  let x = y.left;
  let T2 = x.right;

  x.right = y;
  y.left = T2;

  y.height = Math.max(height(y.left), height(y.right)) + 1;
  x.height = Math.max(height(x.left), height(x.right)) + 1;

  return x;
}

function leftRotate(x) {
  document.getElementById("rotationInfo").innerText = "RR Rotation";
  let y = x.right;
  let T2 = y.left;

  y.left = x;
  x.right = T2;

  x.height = Math.max(height(x.left), height(x.right)) + 1;
  y.height = Math.max(height(y.left), height(y.right)) + 1;

  return y;
}

function insert(node, value) {
  if (!node) return new Node(value);

  if (value < node.value) node.left = insert(node.left, value);
  else if (value > node.value) node.right = insert(node.right, value);
  else return node;

  node.height = 1 + Math.max(height(node.left), height(node.right));
  let balance = getBalance(node);

  if (balance > 1 && value < node.left.value) return rightRotate(node);
  if (balance < -1 && value > node.right.value) return leftRotate(node);
  if (balance > 1 && value > node.left.value) {
    node.left = leftRotate(node.left);
    document.getElementById("rotationInfo").innerText = "LR Rotation";
    return rightRotate(node);
  }
  if (balance < -1 && value < node.right.value) {
    node.right = rightRotate(node.right);
    document.getElementById("rotationInfo").innerText = "RL Rotation";
    return leftRotate(node);
  }

  return node;
}

function minValueNode(node) {
  let current = node;
  while (current.left != null) current = current.left;
  return current;
}

function deleteNodeBST(node, value) {
  if (!node) return node;

  if (value < node.value) node.left = deleteNodeBST(node.left, value);
  else if (value > node.value) node.right = deleteNodeBST(node.right, value);
  else {
    if (!node.left || !node.right) {
      node = node.left ? node.left : node.right;
    } else {
      let temp = minValueNode(node.right);
      node.value = temp.value;
      node.right = deleteNodeBST(node.right, temp.value);
    }
  }

  if (!node) return node;

  node.height = 1 + Math.max(height(node.left), height(node.right));
  let balance = getBalance(node);

  if (balance > 1 && getBalance(node.left) >= 0) return rightRotate(node);
  if (balance > 1 && getBalance(node.left) < 0) {
    node.left = leftRotate(node.left);
    return rightRotate(node);
  }
  if (balance < -1 && getBalance(node.right) <= 0) return leftRotate(node);
  if (balance < -1 && getBalance(node.right) > 0) {
    node.right = rightRotate(node.right);
    return leftRotate(node);
  }

  return node;
}

function insertNode() {
  const val = parseInt(valueInput.value);
  if (!isNaN(val)) {
    root = insert(root, val);
    highlight = null;
    drawTree();
  }
}

function deleteNode() {
  const val = parseInt(valueInput.value);
  if (!isNaN(val)) {
    root = deleteNodeBST(root, val);
    highlight = null;
    document.getElementById("rotationInfo").innerText = "Node Deleted";
    drawTree();
  }
}

function searchNode() {
  highlight = parseInt(valueInput.value);
  drawTree();
}

function drawTree() {
  const canvas = document.getElementById("treeCanvas");
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNode(ctx, root, canvas.width / 2, 40, canvas.width / 4);
}

function drawNode(ctx, node, x, y, gap) {
  if (!node) return;

  // Draw node circle
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2);
  ctx.fillStyle = node.value === highlight ? "#ff5252" : "#90caf9";
  ctx.fill();
  ctx.stroke();

  // Draw value inside node
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(node.value, x - 7, y + 5);

  // Draw height next to node
  ctx.fillStyle = "green";
  ctx.font = "14px Arial";
  ctx.fillText(`H:${node.height}`, x + 30, y - 10);

  // Draw left and right child connections
  if (node.left) {
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x - gap, y + 75);
    ctx.stroke();
    drawNode(ctx, node.left, x - gap, y + 75, gap / 2);
  }

  if (node.right) {
    ctx.beginPath();
    ctx.moveTo(x, y + 25);
    ctx.lineTo(x + gap, y + 75);
    ctx.stroke();
    drawNode(ctx, node.right, x + gap, y + 75, gap / 2);
  }
}
