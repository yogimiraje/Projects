;; The first three lines of this file were inserted by DrRacket. They record metadata
;; about the language level of this file in a form that our tools can easily process.
#reader(lib "htdp-intermediate-lambda-reader.ss" "lang")((modname robot) (read-case-sensitive #t) (teachpacks ()) (htdp-settings #(#t constructor repeating-decimal #f #t none #f ())))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                              ROBOT.RKT
;; 
;; This program provides some functions that will help to identify if a path
;; exists from a source position to a target position on the chessboard. 
;; If a path exists then the path function would return a plan of moves 
;; for the robot representing the moves that need to be made in order to 
;; reach the target position from the source.
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
(require rackunit)
(require "sets.rkt")
(require "extras.rkt")

(provide path)
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                            APPROACH
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; The given chessboard is infinite, but we make it finite by limiting it by the
;; farthest position in the given list of blocks, source and target position. 
;; This helps us in limiting the number of possible paths to reach from source
;; to target position.
;; For finding the path from source to target position on the bounded 
;; chess board, first of all we check if the path is reachable. It is achieved
;; by Breadth first search on the bounded chessboard from the source position. 
;; If the target is unreachable then false is returned, otherwise
;; we do depth first search from the source position to the target position and
;; at every step we keep track of the positions traversed so far. Once target is 
;; found, we use those positions to make a path. 
;;
;; While doing depth first search we always choose the closest available 
;; position to the target position. 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                            DATA DEFINITIONS
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

;; A Position is a (list PosInt PosInt)
;;
;; INTERPRETATION:
;; (x y) represents the position x, y.
;;
;; TEMPLATE:
;; posn-fn : Position -> ??
#;
(define (position-fn posn)
  (... (first posn) ... (second posn)))

;; A ListOf<Position> (LOP) is one of
;; -- empty
;; -- (cons Position ListOf<Position>)
;;
;; INTERPRETATION: 
;; empty - represents a empty list of positions
;; (cons Position ListOf<Position>) represents a list of positions containing a 
;; Position followed by a ListOf<Position>
;; 
;; TEMPLATE: 
;; lop-fn : LOP -> ??
#;
(define (lop-fn lop)
  (cond
    [(empty? lop) ...]
    [else (... (first lop)
               ... (lop-fn (rest lop)))]))

;; A NonEmptyListOf<Position> (NELOP) is one of
;; -- (cons Position empty)
;; -- (cons Position NonEmptyListOf<Position>)
;;
;; INTERPRETATION: 
;; (cons Position empty) - represents a list with one Position
;; (cons Position NonEmptyListOf<Position>) represents a list of positions 
;; containing a Position followed by a NonEmptyListOf<Position>
;; 
;; TEMPLATE: 
;; nelop-fn : NELOP -> ??
#;
(define (nelop-fn nelop)
  (cond
    [(empty? (rest nelop)) ...(position-fn (first nelop))]
    [else (... (first nelop)
               (nelop-fn (rest nelop)))]))

;; A MaybeListOf<Position> (MbLOP) is one of
;; -- false
;; -- ListOf<Position>
;;
;; INTERPRETATION: 
;; MaybeListOf<Position> is either false or a list of positions
;;
;; TEMPLATE
;; maybe-lop-fn : MbLOP -> ??
#;
(define (maybe-lop-fn mblop)
  (cond
    [(false? mblop) ...]
    [(list? mblop) ...(lop-fn mblop)...]))

;; A Move is a (list Direction PosInt)
;;
;; INTERPRETATION:
;; a move of the specified number of steps in the indicated
;; direction. 
;; 
;; TEMPLATE:
;; move-fn : Move -> ??
#;
(define (move-fn m)
  (... (first m) ... (second m)))

;; A ListOf<Move> (LOM) is one of
;; -- empty
;; -- (cons Move ListOf<Move>)
;;
;; INTERPRETATION: 
;; empty - represents a empty list of moves
;; (cons Move ListOf<Move>) represents a list of moves containing a Move 
;; followed by a ListOf<Move>
;; 

;; TEMPLATE: 
;; lom-fn : LOM -> ??
#;
(define (lom-fn lom)
  (cond
    [(empty? lom) ...]
    [else (... (first lom)
               (lom-fn (rest lom)))]))

;; A NonEmptyListOf<Move> (NELOM) is one of
;; -- (cons Move empty)
;; -- (cons Move NonEmptyListOf<Move>)
;;
;; INTERPRETATION: 
;; (cons Move empty) - represents a list with one move
;; (cons Move NonEmptyListOf<Move>) represents a list of moves containing
;; a Move followed by a NonEmptyListOf<Move>
;; 
;; TEMPLATE: 
;; nelom-fn : NELOM -> ??
#;
(define (nelom-fn nelom)
  (cond
    [(empty? (rest nelom)) ...(move-fn (first nelom))]
    [else (... (first nelom)
               (nelom-fn (rest nelom)))]))


;; A Direction is one of
;; -- "north" 
;; -- "east"
;; -- "south"
;; -- "west"
;;
;; INTERPRETATION:
;;
;; north -- reperesents the north direction
;; east  -- reperesents the east direction
;; south -- reperesents the south direction
;; west  -- reperesents the west direction
;;
;; TEMPLATE
;; direction-fn : Direction -> ??
#;
(define (direction-fn dir)
  (cond
    [(string=? NORTH dir) ...]
    [(string=? EAST dir) ...]
    [(string=? SOUTH dir) ...]
    [(string=? WEST dir) ...]))


;; A Plan is a ListOf<Move>
;; WHERE: the list does not contain two consecutive moves in the same
;; direction. 

;; MaybePlan is one of
;; -- false
;; -- Plan
;;
;; INTERPRETATION:
;; MaybePlan is either false or a Plan.
;;
;; TEMPLATE:
;; maybe-plan-fn: MaybePlan -> ??
#;
(define (maybe-plan-fn mbplan)
  (cond
    [(false? mbplan) ...]
    [(plan? mbplan) (... lom-fn (mbplan)...)]))


(define-struct chessboard(occupied-posn-sets vacant-posn-sets))
;; A ChessBoard is (make-chessboard PositionSet PositionSet)
;;
;; WHERE: both occupied-posn-sets and vacant-posn-sets can not be empty at the
;;        same time and both positions sets are mutually exclusive.
;;
;; INTERPRETATION: 
;; A chessboard has
;;  -- occupied-posn-sets : represents occupied position sets on chessboard
;;  -- vacant-posn-sets: represents vacant position sets on chessboard 
;; If occupied-posn-sets is empty, vacant-posn-sets is non-empty and if 
;; vacant-posn-sets is empty , occupied-posn-sets is non-empty i.e both 
;; elements can NOT be empty at the same time.
;; None of the positions in occupied-posn-sets is present in vacant-posn-sets
;; and vice versa.

;; TEMPLATE: 
;; chessboard-fn: ChessBoard -> ??
#;
(define (chessboard-fn cb)
  (... 
   (chessboard-occupied-posn-sets cb)
   (chessboard-vacant-posn-sets cb)))


;; A ListofIntegers (LONNI) is either:
;; -- empty
;; -- (cons nni LONNI)
;; 
;; Interpretation:
;;     -- empty represents a sequence with no element
;;     -- (cons num LONNI) represents a sequence whose first element is a 
;;        non-negative integer and whose other elements are represented by LONNI
;;
;; Template:
;; lonni-fn : LONNI -> ??
;; (define (lonni-fn lonni)
;;   (cond
;;     [(empty? lonni) ...]
;;     [else (...(first lonni))
;;               (lonni-fn (rest lonni)))]))


;; EXAMPLES:
;; See examples for testing 
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                             CONSTANTS
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;; Direction constants

(define NORTH "north")
(define EAST "east")
(define SOUTH "south")
(define WEST "west")

;; Some invalid Direction
(define NORTH-WEST "north-west")

;; base value for calculating max value in a list
(define BASE-VALUE 0)

;; default direction of the robot
(define DEFAULT-DIRECTION NORTH)

;; represent the minimum value of a coordinate
(define MIN-X 1)
(define MIN-Y 1)

;; represent the delta for the neighbour
(define DELTA-X 1)
(define DELTA-Y 1)

;; represent the buffer for farthest position
(define BUFFER 1)

;; represent none
(define NONE 0)

;; last 2 elements
(define LAST-TWO-ELEMENTS 2)

;; last element index
(define LAST-ELEMENT-INDEX 1)

;; minimum step size
(define MIN-STEP 1)

;; minimum difference buffer
(define MIN-DIFF 0)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                           EXAMPLES FOR TESTING
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;

(define move-1 (list SOUTH 1))
(define move-2 (list EAST 1))

(define nelom-1 (list (list "south" 2)))

(define posn-1 (list 1 1))
(define posn-2 (list 10 1))
(define posn-3 (list 2 1))
(define posn-4 (list 11 2))
(define posn-5 (list 1 2))
(define posn-6 (list 10 10))
(define posn-7 (list 2 2))
(define posn-8 (list 3 5))
(define posn-9 (list 3 3))

(define possible-positions-1 (list
                              (list 2 1)
                              (list 1 2)
                              (list 0 1)
                              (list 1 0)))

(define unreachable-nodes-1 
  (list (list 9 9) (list 9 10) (list 9 11) (list 10 11)
        (list 10 9) (list 11 9) (list 11 10) (list 11 11)))

(define lob-1 (list (list 9 9) (list 9 10) (list 9 11) (list 11 11)
                    (list 10 9) (list 11 9) (list 11 10)))

(define path-1 
  (list
   (list "east" 1) (list "south" 1) (list "east" 1) (list "south" 1)
   (list "east" 1) (list "south" 1) (list "east" 1) (list "south" 1)
   (list "east" 1) (list "south" 1) (list "east" 1) (list "south" 1)
   (list "east" 1) (list "south" 1) (list "east" 4) (list "south" 4)
   (list "west" 2) (list "north" 2)))


(define lob-2 (list (list 1 3) (list 2 4) (list 3 3)))

(define path-2 (list (list "east" 2) (list "south" 3) (list "west" 1)))

(define path-of-positions-3 
  (list (list 1 1) (list 2 1) (list 2 2) (list 3 2) (list 3 3)))

; a list of non-negative integers
(define lonni-1 (list 1 2 3))
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;                         FUNCTION DEFINITION
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; reachable? : Position Position LOP -> Boolean
; GIVEN: a source position, target postion and a list of blocked 
; positions on some chessboard
; RETURNS: true if the target is reachable from the source position, else
; returns false
; EXAMPLES:
;  (reachable? posn-1 posn-6 empty)               -> true
;  (reachable? posn-1 posn-6 unreachable-nodes-1) -> false
;
; STRATEGY: Function Composition

(define (reachable? sp tp lob)
  (and
   (not (member? sp lob)) 
   (not (member? tp lob))
   (target-reachable? sp sp tp lob (list sp) (list sp))))

; target-reachable? : Position Position Position LOP LOP LOP -> Boolean
; GIVEN: current position, source position, target postion
; list of blocked positions, list of unvisited positions,
; list of seen positions
; WHERE: 1.unvisited is the list of positions for which neighbours are not yet
; found 2. seen is the list of positions found till now
;
; RETURNS: true if the target is reachable from the source position, else
; returns false
;
; EXAMPLES: 
; (target-reachable? posn-1 posn-1 posn-6
;                    empty (list posn-1) (list posn-1)) -> true   
; (target-reachable? posn-1 posn-1 posn-6
;                    unreachable-nodes-1 (list posn-1) (list posn-1)) -> false
;
; STRATEGY: General Recursion
;
; HALTING MEASURE: The number of unvisited positions 
; TERMINATION ARGUMENT: At every recursive call, the number of unvisted  
; positions decreases

(define (target-reachable? cp sp tp lob unvisited seen)
  (cond
    [(posn-equal? cp tp) true]
    [(empty? unvisited) false]
    [else 
     (local       
       ((define unvisited-neighbours 
          (valid-neighbours (first unvisited) sp tp seen lob)))        
       (target-reachable? 
        (first unvisited) sp tp lob 
        (set-union unvisited-neighbours (rest unvisited))
        (set-union unvisited-neighbours seen)))]))


; path : Position Position ListOf<Position> -> Maybe<Plan>
; GIVEN:
; 1. the starting position of the robot (source position)
; 2. the target position that robot is supposed to reach (target position)
; 3. A list of the blocks on the board (list of blocks)
; RETURNS: a plan that, when executed, will take the robot from
; the starting position to the target position without passing over any
; of the blocks, or false if no such sequence of moves exists.
; EXAMPLES: (path posn-1 posn-6 (list posn-6)) -> false
; STRATEGY: Function Composition

(define (path source-posn target-posn lob) 
  (if (reachable? source-posn target-posn lob)
      (path-of-moves source-posn target-posn lob) 
      false))

; TESTS:
(begin-for-test
  (check-equal? (path posn-1 posn-6 (list posn-6))
                false
                "No path exists from posn-1 to posn-6 in the given chessboard")
  
  (check-equal? (path (list 1 1) (list 10 10) 
                      (list (list 9 9) (list 9 10) (list 9 11) (list 10 11)
                            (list 10 9) (list 11 9) (list 11 10) (list 11 11)))
                false
                "No path exists from posn-1 to posn-6 in the given chessboard")
  
  (check-equal? (path posn-1 posn-1 lob-1)
                empty
                "plan should be empty if source is the target position")
  (check-equal? (path posn-1 posn-6 lob-1)
                path-1
                "Path shown is not the correct path")
  
  (check-equal? (path posn-7 posn-8 lob-2)
                path-2
                "Path shown is not the correct path")) 


; path-of-moves: Position Position LOP -> Plan      
; GIVEN: source position, target position, list of blocks  
; RETURNS: a list of moves that starts from source position and ends 
; at target position without passing over any blocks
; EXAMPLES: 
; (path-from-positions
;  (path-of-positions posn-1 posn-1 posn-6 lob-1 
;                     (list posn-1) (list posn-1) (list posn-1))) -> path-1
; STRATEGY: Function Composition

(define (path-of-moves source-posn target-posn lob) 
  (path-from-positions
   (path-of-positions source-posn source-posn target-posn lob 
                      (list source-posn) (list source-posn))))

; path-of-positions: Position Position Position LOP LOP LOP -> LOP
; GIVEN: 1.Position for which neighbours will be found (current position - cur)
; 2.source position 3.target position  4.list of blocks 
; 5. list of all positions that are already found (seen positions - seen-posn)
; 6. list of positions formed till now from source to current position 
;    (path found till now - path-til-now)
;
; WHERE: 1. seen-posn is list of positions that are already found above the 
; current position
; 2.path-til-now is path formed from source position above the curent 
; position
;
; RETURNS: path of positions from source position to target position
; EXAMPLES: 
; (path-of-positions posn-1 posn-1 posn-9 empty (list posn 1) (list posn 1))
;                                                    -> path-of-positions-3
; STRATEGY: Function Composition

(define (path-of-positions cur src tgt lob seen-posn path-til-now)
  (if (posn-equal? cur tgt)
      path-til-now
      (path-for-neighbours (valid-neighbours cur src tgt seen-posn lob)
                           src tgt lob seen-posn path-til-now))) 


; path-for-neighbours: LOP Position Position LOP LOP LOP -> MbLOP
; GIVEN: 1.neighbours found for some position (current-neighbours)
; 2.source position (src)  3.target position (tgt) 4.list of blocks 
; 5.seen positions (seen-posn) 6.path found till now (path-til-now)
;
; WHERE: 1. seen-posn is list of positions that are already found above the 
; current neighbours
; 2.path-til-now is the path formed from source position above the curent 
; neighbours
;
; RETURNS: either a list of positions or false 
; EXAMPLE: 
; (path-for-neighbours
;    (list posn-3 posn-5) posn-1 posn-9 empty (list posn-1) (list posn-1))
;                                                   -> path-of-positions-3
; STRATEGY: Structural Decomposition on cur-nbr: LOP, path-finder: MbLOP

(define (path-for-neighbours cur-nbr src tgt lob seen-posn path-til-now)
  (cond
    [(empty? cur-nbr) false]
    [else       
     (local 
       ((define revised-seen-posn (set-union cur-nbr seen-posn))
        (define revised-path (append path-til-now (list (first cur-nbr))))
        (define path-finder (path-of-positions (first cur-nbr) src tgt
                                               lob revised-seen-posn revised-path)))
       (cond
         [(false? path-finder) (path-for-neighbours 
                                (rest cur-nbr) src tgt lob seen-posn path-til-now)]
         
         [(list? path-finder) path-finder]))]))


; path-from-positions : NELOP -> LOM
; GIVEN: a non empty list of positions 
; RETURNS: a list of moves which represents the moves to traverse
; the given list of positions
; EXAMPLES:
;  (path-from-positions (list posn-1))         -> empty 
;  (path-from-positions (list posn-1 posn-3))  -> (list move-2)
; STRATEGY: Structural Decomposition on nelop: NELOP

(define (path-from-positions nelop)
  (cond
    [(empty? (rest nelop)) empty]
    [else (nelom-for-path (rest nelop) (first nelop))]))

; nelom-for-path : NELOP Position -> NELOM
; GIVEN: a non empty list of positions and a position which represents the 
; previous position 
; RETURNS: a non empty list of moves which represents the moves to traverse
; the given list of positions
; EXAMPLES:
;   (nelom-for-path (list posn-3) posn-1) -> (list move-2)
; STRATEGY: Structural Decomposition on nelop: NELOP

(define (nelom-for-path nelop prev-posn)
  (cond
    [(empty? (rest nelop)) 
     (cons (move-for-posns prev-posn (first nelop)) empty)]
    [else (compress-moves-in-same-direction 
           (move-for-posns prev-posn (first nelop))
           (nelom-for-path (rest nelop) (first nelop)))]))


; compress-moves-in-same-direction : Move NELOM -> NELOM
; GIVEN: a move and a non empty list of moves
; RETURNS: returns a NELOM with a step added to the first move of the given
; NELOM if the direction of the first element of the NELOM is the same as that
; of the given move, else returns a NELOM with the given move appended to 
; the given NELOM
;  
; EXAMPLES: 
;  (compress-moves-in-same-direction move-1 (list move-1)) -> nelom-1
;
; STRATEGY: Structural decomposition on m: Move

(define (compress-moves-in-same-direction m nelom)
  (if (direction-match? m (first nelom))
      (cons (create-move (move-direction (first nelom)) 
                         (+ MIN-STEP (move-steps (first nelom)))) (rest nelom))
      (cons m nelom)))

; move-for-posns : Position Position -> Move
; GIVEN: a position and its previous position
; RETURNS: a Move that represents the movement from the previous position
; to the current position
; EXAMPLES: 
;  (move-for-posns posn-1 posn-3) -> move-2
;
; STRATEGY: Function Composition 
(define (move-for-posns prev-posn current-posn)
  (create-move (direction-for-posns prev-posn current-posn) MIN-STEP))

; direction-for-posns: Position Position -> Direction
; GIVEN: a position and its previous position
; RETURNS: a Direction that represents the direction of the movement from 
; the previous position to the current position
; EXAMPLES: 
;   (direction-for-posns posn-1 posn-3) -> EAST
; 
; STRATEGY: Structural Decomposition on prev-posn: Position and
;                                       current-posn: Position 
(define (direction-for-posns prev-posn current-posn)
  (cond
    [(= (pos-x current-posn) (pos-x prev-posn))
     (direction-of-vertical-movement (pos-y current-posn) (pos-y prev-posn))]
    
    [(= (pos-y current-posn) (pos-y prev-posn))
     (direction-of-horizontal-movement (pos-x current-posn) (pos-x prev-posn))]))

; direction-of-vertical-movement: PosInt PosInt -> Direction
; direction-of-horizontal-movement: PosInt PosInt -> Direction
; GIVEN: x or y co-ordinates of two positions
; RETURNS: a direction based on the difference between the given co-ordinates
; EXAMPLES: (direction-of-vertical-movement 2 1) -> SOUTH
; (direction-of-horizontal-movement 2 1) -> EAST
; STRATEGY: Function Composition

(define (direction-of-vertical-movement yc yp) 
  (if (> (- yc yp) MIN-DIFF)
      SOUTH
      NORTH))

(define (direction-of-horizontal-movement xc xp)
  (if (> (- xc xp) MIN-DIFF)
      EAST
      WEST))

; valid-neighbours : Position Position Position LOP LOP -> LOP
; GIVEN: current position, source position, target postion
; a list of traversed postions and a list of blocked positions
; RETURNS: returns the valid neighbours of the current position in the
; sorted order of distance to the target postion. the list of valid 
; neighbours is the list of neighbours that does not contain neigbours which
; are blocks or already traversed and which are beyond the farthest position
;
; EXAMPLES:
;  (valid-neighbours posn-1 posn-1 posn-2 empty (list posn-3)) -> (list posn-5)
;  (valid-neighbours posn-1 posn-1 posn-2 empty (list posn-5 posn-3)) -> empty
;
; STRATEGY: Higher Order Function Compostion

(define (valid-neighbours p s d tp lob)
  (sorted-neighbours 
   (filter
    ; Position -> Boolean
    ; GIVEN: a position
    ; RETURNS: true if the given position is not beyond the farthest position
    ; and is not blocked nor traversed
    (lambda (p1) 
      (and 
       (before-farthest-posn? p1 (cons s (cons d lob)))       
       (not (member? p1 lob))
       (not (member? p1 tp))))
    (neighbours p))
   d))


; neighbours : Position -> LOP
; GIVEN: a position
; RETURNS: a list of all neigbhouring postions of the given position
; EXAMPLES: 
;  (neighbours posn-1) -> possible-positions-1
; STRATEGY: Structural Decomposition on p: Position

(define (neighbours p)
  (list
   (create-pos (+ DELTA-X (pos-x p)) (pos-y p))
   (create-pos (pos-x p) (+ DELTA-Y (pos-y p)))
   (create-pos (- (pos-x p) DELTA-X) (pos-y p))
   (create-pos (pos-x p) (- (pos-y p) DELTA-Y))))


; before-farthest-posn? : Position LOP -> Boolean
; GIVEN: a postion and a list of positions
; RETURNS: true if the given postion is before the farthest postion in the 
; given list of positions
; EXAMPLES: 
;   (before-farthest-posn? posn-2 (list posn-1 posn-3)) ->false 
;
; STRATEGY: Structural decompostion on p : Position

(define (before-farthest-posn? p lop) 
  (and (>= (pos-x (farthest-posn lop)) (pos-x p) MIN-X) 
       (>= (pos-y (farthest-posn lop)) (pos-y p) MIN-Y)))


; farthest-posn : LOP -> Position 
; GIVEN: a list of positions
; RETURNS: returns the farthest position in the list i.e the position
; with maximum x and y coordinates
; EXAMPLES:
;  (farthest-posn (list posn-1 posn-3 posn-2)) -> posn-4
; 
; STRATEGY: Function Compostion

(define (farthest-posn lop)
  (list
   (+ (max-x-coordinate lop) BUFFER)
   (+ (max-y-coordinate lop) BUFFER)))

; max-x-coordinate : LOP -> PosInt 
; GIVEN: a list of positions
; RETURNS: returns the max value of the x coordinate in the 
; given list of positions
; EXAMPLES:
;  (max-x-coordinate (list posn-1 posn-3 posn-2)) -> 10
; 
; STRATEGY: Higher Order Function Compostion

(define (max-x-coordinate lop)
  (max-coordinate lop first))

; max-y-coordinate : LOP -> PosInt 
; GIVEN: a list of positions
; RETURNS: returns the max value of the y coordinate in the 
; given list of positions
; EXAMPLES:
;  (max-y-coordinate (list posn-1 posn-3 posn-2)) -> 1
; 
; STRATEGY: Higher Order Function Compostion

(define (max-y-coordinate lop)
  (max-coordinate lop second))

; max-coordinate : LOP (Position -> PosInt) -> PosInt
; GIVEN: a list of positions and a coordinate accessor function
; RETURNS: returns the max value of the required coordinate in the 
; given list of positions
; EXAMPLES:
;  (max-coordinate (list posn-1 posn-3 posn-2) pos-y) -> 10
; 
; STRATEGY: Higher Order Function Compostion

(define (max-coordinate lop f)
  (max-in-list (map f lop)))


; distance : Position Position -> NonNegInt
; GIVEN: two positions 
; RETURNS: the square of the distance between the two positions
; EXAMPLES: 
;   (distance posn-1 posn-2) -> 81
; STRATEGY: Structural Decomposition on p1,p2: Position

(define (distance p1 p2)
  (+ (sqr (- (pos-x p1) (pos-x p2))) (sqr(- (pos-y p1) (pos-y p2)))))

; sorted-neighbours : LOP Position -> LOP
; GIVEN: a list of positions and a position which represents a destination
; RETURNS: a list of positions which are sorted by their distance to the
; given destination
; EXAMPLES:
;   (sorted-neighbours (list posn-1 posn-3) posn-2) -> (list posn-3 posn-1)
; STRATEGY: Higher Order Function Composition

(define (sorted-neighbours lop d)
  (sort lop 
        ; Position Position -> Boolean
        ; GIVEN: two positions to be compared
        ; RETURNS: true if p1 is closer to the given destination than p2
        ; else returns false
        (lambda (p1 p2) 
          (< (distance p1 d) 
             (distance p2 d)))))


; pos-x : Position -> PosInt
; GIVEN: a Position 
; RETURNS: the x coordinate of the given position
; EXAMPLES: 
;   (pos-x posn-2) -> 10
; STRATEGY: Structural Decomposition on p: Position

(define (pos-x p)
  (first p))


; pos-y : Position -> PosInt
; GIVEN: a Position 
; RETURNS: the y coordinate of the given position
; EXAMPLES: 
;   (pos-y posn-1) -> 1
; STRATEGY: Structural Decomposition on p: Position

(define (pos-y p)
  (second p))

; create-pos : PosInt PosInt -> Position
; GIVEN: the x and y coordinates of a position
; RETURNS: a Position 
; EXAMPLES: 
;   (create-pos 1 1) -> posn-1
; STRATEGY: Function Composition

(define (create-pos x y)
  (list x y))


; posn-equal? : Position Position -> Boolean
; GIVEN: two positions 
; RETURNS: true if both the positions are equal else returns false
; EXAMPLES: 
;   (create-pos 1 1) -> true
; STRATEGY: Structural Decomposition on p1,p2: Position

(define (posn-equal? p1 p2)       
  (and (= (pos-x p1) (pos-x p2))
       (= (pos-y p1) (pos-y p2))))


; move-direction : Move -> Direction
; GIVEN: a Moves
; RETURNS: the direction in the given move
; EXAMPLES: 
;   (move-direction move-1) -> SOUTH
; STRATEGY: Structural Decomposition on m: Move

(define (move-direction m)
  (first m))


; move-steps : Move -> PosInt
; GIVEN: a Move
; RETURNS: the number of steps in the given move
; EXAMPLES: 
;   (move-steps move-1) -> 1
; STRATEGY: Structural Decomposition on m: Move

(define (move-steps m)
  (second m))

; create-move : Direction PosInt
; GIVEN: a direction and the number of steps for a move
; RETURNS: a move with the given values
; EXAMPLES: 
;   (create-move NORTH 10) -> (list NORTH 10)
; STRATEGY: Function Composition

(define (create-move d s)
  (list d s))


; max-in-list : LONNI -> NonNegativeInteger
; GIVEN : a list of non negative integers
; RETURNS: the non negative integer having the maximum value in the given list
; EXAMPLES: 
;  (max-in-list (list 1 2 4)) -> 4
; STRATEGY: Higher Order Function Composition
(define (max-in-list lonni)
  (foldr
   ; NonNegativeInteger NonNegativeInteger -> NonNegativeInteger
   ; GIVEN   : a non negative integer and max of some non negative integers
   ; RETURNS : max of the given non negative integer and the given max
   (lambda (n max-so-far)
     (max n max-so-far))
   BASE-VALUE lonni))


; plan? : Any ->  Boolean
; GIVEN: any argument
; RETURNS: true iff the given argument is a plan
; EXAMPLES: (plan? (list (list 1 2))) -> false
; STRATEGY: Function Composition
(define (plan? mbplan)
  (and (list? mbplan)
       (andmap move? mbplan)
       (consecutive-moves-not-same? mbplan)))

; TESTS:
(begin-for-test
  (check-equal? 
   (plan? empty) true
   "Given MaybePlan is an empty Plan")
  
  (check-equal? 
   (plan? (list (list NORTH 2) (list SOUTH 1))) true
   "Given MaybePlan is a Plan")
  
  (check-equal? 
   (plan? (list (list NORTH 0) (list SOUTH 1))) false
   "Given MaybePlan is a Not a Plan")
  
  (check-equal? 
   (plan? (list (list NORTH-WEST 0) (list SOUTH 1))) false
   "Given MaybePlan is a Not a Plan")
  
  (check-equal? 
   (plan? (list (list WEST 3) (list SOUTH 1.4))) false
   "Given MaybePlan is a Not a Plan")
  
  (check-equal? 
   (plan? (list (list WEST 3) (list WEST 1))) false
   "Given MaybePlan is a Not a Plan"))


; move? : Any ->  Boolean
; GIVEN: any argument
; RETURNS: true iff the given argument is a move
; EXAMPLES: 
;  (move? move-1) -> true
; STRATEGY: Function Composition
(define (move? a-move)
  (and (= (length a-move) LAST-TWO-ELEMENTS)
       (direction? (first a-move))
       (and (integer? (second a-move)) (> (second a-move) NONE))))

; direction? : Any ->  Boolean
; GIVEN: any argument
; RETURNS: true iff the given argument is a direction
; EXAMPLES: 
;  (direction? NORTH) -> true
; STRATEGY: Function Composition
(define (direction? dir)
  (and (string? dir)
       (or (string=? dir NORTH)
           (string=? dir EAST)
           (string=? dir SOUTH)
           (string=? dir WEST))))

; consecutive-moves-not-same? : LOM ->  Boolean
; GIVEN: a list of moves
; RETURNS: false iff any consecutive moves in the list have the same direction
; EXAMPLES: 
;  (consecutive-moves-not-same? (list move-1 move-2)) -> true
; STRATEGY: General Recursion 
; HALTING MEASURE: length of the given list of moves
; TERMINATION ARGUMENT: At every recursive call, the length of the given list  
; of moves reduces

(define (consecutive-moves-not-same? lom)
  (cond
    [(empty? lom) true]
    [(= (length lom) LAST-ELEMENT-INDEX) true]
    [else
     (if (direction-match? (first lom) (second lom))
         false
         (consecutive-moves-not-same? (rest lom)))]))

; direction-match? : Move Move -> Boolean
; GIVEN: two moves
; RETURNS: true iff the the given moves have the same direction
; EXAMPLES: 
;  (direction-match? move-1 move-2) -> false
; STRATEGY: Function Composition
(define (direction-match? move1 move2)
  (string=? (first move1) (first move2)))