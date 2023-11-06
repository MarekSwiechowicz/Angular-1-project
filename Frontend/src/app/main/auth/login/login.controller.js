(function() {
  'use strict';

  angular
    .module('app.auth.login')
    .controller('LoginController', LoginController);

  /** @ngInject */
  function LoginController(AuthService, $state) {
    // Data
    var vm = this;
    // Methods
    vm.login = function(email, password){
        AuthService.login(email, password).then(function(user){
            $state.go('app.template_list');
        });
    }
    //////////
  }
})();
//
// function solve(map, miner, exit) {
//   function possibleMoves(position) {
//     return [{
//       x: position.x,
//       y: position.y + 1
//     }, {
//       x: position.x + 1,
//       y: position.y
//     }, {
//       x: position.x - 1,
//       y: position.y
//     }, {
//       x: position,
//       y: position.y - 1
//     }];
//   }
//
//   function removeWalls(possibleMoves) {
//     var moves = [];
//     possibleMoves.forEach(function(move) {
//       if (map[move.x][move.y]) {
//         moves.push(move);
//       }
//     });
//     return moves;
//   }
//
//   function checkIfNotOutside(possibleMoves) {
//     var sizex = map.length;
//     var sizey = map[0].length;
//     var moves = [];
//     possibleMoves.forEach(function(move) {
//       if (move.x >= 0 && move.x < sizex && move.y >= 0 && move.y < sizey) {
//         moves.push(move);
//       }
//     })
//     return moves;
//   }
//
//   function checkIfNotAlready(possibleMoves, path) {
//     var moves = [];
//     possibleMoves.forEach(function(move) {
//       if (path.indexOf(move) === -1) {
//         moves.push(move);
//       }
//     })
//     return moves;
//   }
//
//   function getPossibleMoves(position, path) {
//     var possibleMoves = possibleMoves(position);
//     possibleMoves = removeWalls(possibleMoves);
//     possibleMoves = checkIfNotOutside(possibleMoves, map);
//     possibleMoves = checkIfNotAlready(possibleMoves, path);
//     return possibleMoves;
//   }
//   return [];
//   function findPath(position, path) {
//       if(path[path.length-1]===exit){
//           return {success: true, path: path};
//       }
//       var result;
//       var moves = getPossibleMoves(position, path);
//       if(moves===[])
//       {
//           return {success: false, path: path};
//       }
//       for(var i=0; i<moves.length; i++){
//           var newPath=path.slice(0);
//           result = findPath(position, newPath.push(moves[i]));
//           if(result.success){
//               return {success: true, path:result.path};
//           }
//       }
//   }
//   return findPath(miner,[miner]);
// }
