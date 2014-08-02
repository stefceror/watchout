// start slingin' some d3 here.

var gameOptions = {
  height: 450,
  width: 700,
  nEnemies: 30,
  padding: 20,
  color: 'teal'
};

var gameStats = {
  score: 5,
  highScore: 0
};

var axes = {
  x: d3.scale.linear().domain([0,100]).range([0, gameOptions.width]),
  y: d3.scale.linear().domain([0,100]).range([0, gameOptions.height])
};

d3.select('body').append('div').attr("class","container");

var gameBoard = d3.select('.container')
                  .append('svg:svg')
                  .attr('width', gameOptions.width)
                  .attr('height', gameOptions.height)
                  .style('background-color', gameOptions.color);

var updateScore = function(){
  d3.select('.current span')
    .text(gameStats.score.toString());
};

var updateBest = function() {
  gameStats.highScore = Math.max(gameStats.highScore, gameStats.score);
  d3.select('.high span').text(gameStats.highScore.toString());
};

var Player = function(gameOptions){
    this.path = 'm-7.5,1.62413c0,-5.04095 4.08318,-9.12413 9.12414,-9.12413c5.04096,0 9.70345,5.53145 11.87586,9.12413c-2.02759,2.72372 -6.8349,9.12415 -11.87586,9.12415c-5.04096,0 -9.12414,-4.08318 -9.12414,-9.12415z'
    this.fill = '#ff6600';
    this.x = 50;
    this.y = 50;
    this.angle = 0;
    this.r = 5;
    this.gameOptions = gameOptions;
};

Player.prototype.render = function( to ){
  this.el = to.append('svg:path')
              .attr('d', this.path)
              .attr('fill', this.fill);
  this.transform(this.gameOptions.width*0.5, this.gameOptions.height*0.5);
  this.setupDragging();
  return this;
};

Player.prototype.getX = function() {
  return this.x;
};

Player.prototype.setX = function(x) {
  var minX = this.gameOptions.padding;
  var maxX = this.gameOptions.width - this.gameOptions.padding;
  if (x <= minX) { x = minX; }
  if (x >= maxX) { x = maxX; }
  this.x = x;
};

Player.prototype.getY = function() {
  return this.y;
};

Player.prototype.setY = function(y) {
  var minY = this.gameOptions.padding;
  var maxY = this.gameOptions.height - this.gameOptions.padding;
  if (y <= minY) { y = minY; }
  if (y >= maxY) { y = maxY; }
  this.y = y;
};

Player.prototype.transform = function(x, y, angle) {
  this.setX(x||this.x);
  this.setY(y||this.y);
  this.angle = angle || this.angle;
  return this.el.attr('transform',
          ("rotate(" + this.angle + "," + (this.getX()) + "," + (this.getY()) + ") ")
          + ("translate(" +(this.getX()) + "," + (this.getY()) + ")"));
}

Player.prototype.moveRelative = function(dx, dy){
  this.transform(
    this.getX()+dx,
    this.getY()+dy,
    360*(Math.atan2(dy,dx)/(Math.PI*2))
  )
}

Player.prototype.setupDragging = function() {
  var context = this;
  var dragMove = function() {
    return context.moveRelative(d3.event.dx, d3.event.dy);
  };
  var drag = d3.behavior.drag().on('drag', dragMove);
  return this.el.call(drag);
};

var player = [new Player(gameOptions).render(gameBoard)];
