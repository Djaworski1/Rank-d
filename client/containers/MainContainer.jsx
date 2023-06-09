import React, { useEffect, useRef } from 'react';
import Row from './Row.jsx'
import SelectRow from './SelectionRow.jsx';
import {socket} from '../socket'
import {connect} from 'react-redux';
import * as actions from '../actions/actions';

const mapDispatchToProps = dispatch => (
    {
        loadSelections: (array) => dispatch(actions.loadSelections(array)),
        submitBoard: () => dispatch(actions.submitBoard()),
        loadCategory: (category) => dispatch(actions.loadCategory(category)),
        addChoice: (contents) => dispatch(actions.addChoice(contents))
    }
)
const mapStateToProps = state => (
    {
        score: state.cards.score,
        category: state.cards.category,
    }
)

const MainContainer = props => {
    const topCardColors = ['#D26864', '#D69859', '#E6BE68', '#EFEB7D', '#C6D673'];
    const ranks = ['S', 'A', 'B', 'C', 'D'];
    const rowArr = [];
    const inputContents = useRef('');

    for (let i = 0; i < 5; i++) {
        rowArr.push(<Row key={'row' + i} row={ranks[i]} topColor={topCardColors[i]}/>)
    };

    useEffect(() => {
        fetch('/people/getAllPeople', {
            headers: { 'Content-Type': 'application/json' },
          })
        .then(res => res.json())
        .then(res => {
            props.loadSelections(res['people'])
            props.loadCategory(res['category'])
        })
        
    }, [])
    
    const submitHandler = (e) => {
        e.preventDefault()
        props.submitBoard()
    }

    const addHandler = (e) => {
        e.preventDefault()
        console.log(inputContents)
        props.addChoice(inputContents.current.value)
    }

    const onChangeHandler = (e) => {
        e.preventDefault()
        console.log(inputContents)
    }
    
    socket.on('connection', () => {
        console.log('front connected')
    })

    return(
        <div>
            <div className='header'>
                <h1>{'RANK\'D'}</h1>
            </div>
            <div className='header'>
                <h2>{`Your Category is... ${props.category}`}</h2>
                <h3>Place each person where you think they rank in the category</h3>
                <h2>{props.score > 0 ? <div style={{border: 'solid grey'}}>Correct rankings = {props.score}</div> : <div></div>}</h2>
            </div>
            <div className='cardsContainer'>
                {rowArr}
            </div>
            <div className='selectionContainer'>
                <SelectRow key={'selectionRow'} row={'select'}/>
            </div>
            <div className='ActionsContainer'>
                <h2 style={{"fontSize": '18px'}}>Choose the selection you'd like to replace and hit "Enter"</h2>
                <div className='addOrDeleteContainer'>
                    <input id='button' style={{color: 'white', background: 'black',  border: 'solid grey'}} ref={inputContents} type="text" onChange={onChangeHandler}/>
                    <button id='button' style={{color: "white", background: 'black', border: 'solid grey'}} type="button" onClick={addHandler}>Enter</button>
                </div>
                <div style={{height: "20px"}}/>
                <div className='scoreContainer'>
                    <div></div>
                    <button id='button' style={{height: '50px', width: '100px', color: "white", background: 'black', border: 'solid grey'}} onClick={submitHandler}>Submit choices!</button>
                </div>
            </div>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps) (MainContainer);