import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';

function Square(props) {
  return (
      /* In a function we don't worry about this*/
      /* () => this.props.onClick() was used in class version of Square , to be able to access the this parameter */

      //{props.squareValue}
    <button className={props.squareClasses} onClick={props.onClickFn} disabled={props.disableBtn}>
      {props.squareValue}
    </button>  
  );
}

class MainBoard extends React.Component{

      constructor(props) {
          super(props);

          const totalSquares = 16;

          this.state = {
            squares: this.generateBoardSquares(totalSquares),
            completedSquares: Array(totalSquares).fill(null),
            classesToAssign: Array(totalSquares).fill('squareBtn'),
            previousVal: null,
            previousSquarePos: null,
            totalClicks: 0,              
            totalSquares
          };
      }

      generateBoardSquares(totalSquares){
          /* 4x4 = 16 
             => we need 8 pairs of numbers. (8 different numbers) */
          const pairs = totalSquares / 2;

          let squareValue;
          let finalBoardSquares = [];

          //loop depends on the number of total squares
          for (var pos=0; pos < totalSquares; pos++){                    
                let posFilled = false;
                while(!posFilled){
                      //generate a random value
                      squareValue = this.generateRandomNumber(1,pairs);

                      //check if the value has been generated over 2 times
                      if (!this.checkValueAppearances(finalBoardSquares, squareValue)){ //not found over 2 times
                        finalBoardSquares[pos] = squareValue;      
                        break;              
                      }
                      else{  //value found over 2 times in the array => we need another number
                        continue;
                      } 
                }
          }
          return finalBoardSquares;
      }

      checkValueAppearances(arr, val){
          var count = 0;
          for (var i = 0; i < arr.length; i++) {
              if (arr[i] === val) {
                  count++;
              }

              if (count >= 2)
                return true;
          }
          return false;
      }

      generateRandomNumber(min , max) {
         return Math.floor(Math.random() * (max - min + 1)) + min;
      }

      renderSquareValue(val,i,classes,disableBtn) {
          return (
            <Square
              squareValue={val}
              squareClasses={classes}
              disableBtn={disableBtn}
              onClickFn={() => this.handleClick(val,i)}
            />
          );
      }       

      handleClick(val,i) {

          let completed = this.state.completedSquares.slice();
          const classes = this.state.classesToAssign.map( (el,i) =>{
                if (this.state.completedSquares[i] !== null){
                  return "squareBtn squareBtn-completed";
                }
                else{
                  return "squareBtn";
                }
          });                

          //compare previous val with the current
          // if they are equal => correct combo found => style squares accordingly
          if (val === this.state.previousVal){
                completed[i] = val;
                completed[this.state.previousSquarePos] = this.state.previousVal;

                classes[i] += " squareBtn-completed";
                classes[this.state.previousSquarePos] += " squareBtn-completed";

          }
          else{
                classes[i] += " squareBtn-active";
                classes[this.state.previousSquarePos] += " squareBtn-active";                  
          }

          //set the state
          this.setState({
            previousVal: val,
            previousSquarePos: i,
            completedSquares: completed,
            classesToAssign: classes,
            totalClicks: this.state.totalClicks + 1
          });  

      }
      
      render(){

            const gameboard = this.state.squares.map( (el,i) =>{
                let disableBtn = (this.state.completedSquares[i] !== null) ? true : false; 
                return <div key={i} className="square">
                          {this.renderSquareValue(el,i,this.state.classesToAssign[i],disableBtn)}
                        </div>
            });

            return (
              <div className="game-section">
                <LevelScore 
                  totalClicks={this.state.totalClicks}
                  totalSquares={this.state.totalSquares}
                  completedSquares={this.state.completedSquares}
                />
                <div className="board-section">
                    {gameboard}
                </div>
                <LevelResult 
                    completedSquares={this.state.completedSquares}
                />
              </div>
            );
      }
}

function LevelResult(props){

  let result = '';
  //check if player won the level (all total combos found)
  if ( !props.completedSquares.includes(null) ){
      result = 'Congats!! You won the level';
  }

  return (
      <div className="result-section">
        <span className="result">{result}</span>
      </div>
  );

}

function LevelScore(props){

    let score = '';
    const [moves, squares] = [props.totalClicks, props.totalSquares];

    if ( !props.completedSquares.includes(null) ){
        score = Math.ceil( (squares / moves) * 100 ) + ' /100';  
        //lets say moves are 16, total squares are 16
        // (16 / 16) * 100 = 100% => best score. 
    }


      return (
        <div className="score-section">
            <h4>Your score: <span className="score">{score}</span></h4>
        </div>
      );

}

ReactDOM.render(
  <MainBoard />,          
  document.getElementById('root')
);
