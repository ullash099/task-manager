import React from 'react'
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Badge, Col, Dropdown, DropdownButton, ListGroup, Row } from 'react-bootstrap';
import { AppUrl, ShowToast } from './Context';

export default function TaskList(props) {
    const [taskList,setTaskList] = React.useState({})

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
      
        return result;
      };

    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
          return;
        }
    
        const items = reorder(
            taskList,
            result.source.index,
            result.destination.index
        );
        handelSave(items)
        setTaskList(items)
    }

    const handelSave = async (items) => {
        const data = new FormData()
        items.map((item,i)=> {
            data.append(`id[`+i+`]`, item.id)
            data.append(`display_order[`+i+`]`, i+1)
        })
        await axios.post(AppUrl(`/api/save-reorder-task`),data)
        .then(function (response) {
            let info = response.data;                
            if(info.errors){
                (info.errors).map((error)=>(
                    ShowToast({
                        type : 'error',
                        msg  : error
                    })
                ));
            }
        })
    }

    React.useEffect(()=>{
        setTaskList(props.list)
    },[props])

    if(Object.keys(taskList).length <= 0){
        return <div></div>
    }

    return (
        <DragDropContext onDragEnd={onDragEnd.bind(this)}>
            <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <ListGroup
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                    {
                        (taskList).map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                    <ListGroup.Item as="li"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <Row>
                                            <Col md={10}>
                                                <div className='mr-3'>
                                                {
                                                    item.priority == 'High' ?
                                                        (<Badge bg="warning" className='mr-3'>High</Badge>)
                                                    : item.priority == 'Medium' ?
                                                        (<Badge bg="secondary" className='mr-3'>Medium</Badge>)
                                                    : item.priority == 'Low' ?
                                                        (<Badge bg="primary" className='mr-3'>Low</Badge>)
                                                    :``
                                                }
                                                </div>
                                                <div>{item.name}</div>
                                            </Col>
                                            <Col md={2}>
                                                <DropdownButton title="Action" className="btn-sm float-end">
                                                    <Dropdown.Item eventKey="1" 
                                                        onClick={() => props.onEdit(item)}
                                                    >Edit</Dropdown.Item>
                                                    <Dropdown.Item eventKey="2" 
                                                        onClick={() => props.onDelete(item.id)}
                                                    >Delete</Dropdown.Item>
                                                </DropdownButton>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                            </Draggable>
                        ))
                    }
                    {provided.placeholder}
                    </ListGroup>
                )}
            </Droppable>
        </DragDropContext>
    )
}
