require('../style/Form_body.scss');

import {Row,Icon,Card,CardTitle,Col,MediaBox,Input,PaginationButton,Button,Table } from 'react-materialize'
// import *as ft from 'react-materialize'


class Form_body extends React.Component{
    
        
        constructor(props){
            super(props);
            let table
           if(localStorage.table){

             table =JSON.parse(localStorage.table)
                table.join(',')
           } else {
            table = [];
           }
            
            this.state = {
                table_tr:table ,
                form_validator: 'Please enter data',
                color_form_validator: 'grey',
                search_m_w: 'Man',
                up_down: 'Up'
            }
        }
        submit_form_body(e){
            e.preventDefault()

            if(document.getElementsByClassName('invalid').length===0 && document.getElementsByClassName('active').length === 5){
                const array = {};
               
                array.First_Name = this.First_Name.state.value;
                array.Last_Name = this.Last_Name.state.value;
                array.Phone = this.Phone.state.value;
                if(this.Gender.state.value==='true'){
                    array.Gender='Man'
                } else { array.Gender='Woman'}
                
                array.Age = this.Age.state.value;
              
                this.setState({
                        table_tr: [...this.state.table_tr, array],
                        form_validator: 'Successfully',
                        color_form_validator: 'green'
                    })
                    
                const input_refres = document.getElementById('input_')
                
                for(let i = 0, len = document.getElementsByClassName('input_refresh').length; i < len; i++){
                   
                    document.getElementById(`input_${i}`).value='';
                }
                this.First_Name.state.value=null;
                this.Last_Name.state.value=null;
                this.Phone.state.value=null;
                this.Gender.state.value=null;
                this.Age.state.value=null;
            } else{
                this.set_State_validate('Check the correctness of the input')    
        }          
        }

      
        set_State_validate(name){
                
                this.setState({
                    form_validator:  name,
                    color_form_validator: 'red'
                })
                  }
        del_event(e,i){
            const self_table_tr=this.state.table_tr.slice();
            self_table_tr.splice(e,1)
            this.setState({
                        table_tr: self_table_tr,
                        form_validator: 'Successfully del',
                        color_form_validator: 'blue'
                    })
                }
        localStorage_setItem(){
            const add = JSON.stringify(this.state.table_tr)
            localStorage.setItem('table',add)
        }

        source_m_w(){
            const array = this.state.table_tr.slice();
            const man = [];
            const woman = [];
            let man_woman;
            let slisers;
            for(let i = 0, len = array.length;i < len; i++){
                if(array[i].Gender==='Woman'){
                    woman.push(array[i])
                } else if(array[i].Gender==='Man') {
                    man.push(array[i])
                }
         }
            if(this.state.search_m_w === 'Man'){
            slisers = man.concat(woman).slice()
            man_woman ='Woman'
        } else if(this.state.search_m_w === 'Woman') {
            slisers = woman.concat(man).slice()
            man_woman='Man'
        }
         this.setState({
            search_m_w: man_woman,
            table_tr:slisers
                    })
        }

         age_source(e){
            let date = this.state.table_tr.slice();
            let up_down;
            if(this.state.up_down==='Up'){ up_down = 'Down'} else {up_down ='Up'} 
            let counter = 0;
            for(let i = 0; i < date.length-1;i++){
               if(this.state.up_down==='Up'){
                if(+date[i].Age > +date[i+1].Age){
                    let time = date[i];
                    date[i] = date[i+1];
                    date[i+1] = time;
                    counter++
                }
               } else{
                if(+date[i].Age < +date[i+1].Age){
                    let time = date[i+1];
                    date[i+1] = date[i];
                    date[i] = time;
                    counter++
                }  
               }
                if(i === date.length-2 && counter!==0){
                   i =-1
                   counter=0;
                }
            }
            this.setState({
                table_tr: date,  
                  up_down: up_down
            })   
         }
         

        componentDidMount(){
            document.getElementById('input_0').focus();
       
        }
        componentDidUpdate(){
            this.localStorage_setItem()
            
        }
        render(){
            const self =this;
           const tr_element= this.state.table_tr.map(function(v,i){
               return (
                   <tr key={v+i} id={i}> <td id={v.Last_Name +i }> {v.First_Name}</td><td> {v.Last_Name} </td><td> {v.Phone}</td><td> {v.Gender}</td><td> {v.Age}</td><td><Button onClick={self.del_event.bind(self,i)}>Del</Button></td></tr>
               )
            })
            
            return (
                <div className='form_body' >
                    <Row>
                        <form onSubmit={this.submit_form_body.bind(this)} >
                            <h3 className='form_validator' style={{color:this.state.color_form_validator}} >{this.state.form_validator}</h3>
                            <Input className='input_refresh'  s={12} m={6} l={6} ref={(input) => { this.First_Name = input; }} pattern="[A-Za-zА-Яа-яЁё]{2,}"  validate type='text' label= 'First Name'  />
                            <Input className='input_refresh' s={12} m={6} l={6} ref={(input) => { this.Last_Name = input; }} pattern="[A-Za-zА-Яа-яЁё]{2,}" validate type='text' label='Last Name' />
                            <Input className='input_refresh' s={12} m={6} l={6} ref={(input) => { this.Phone = input; }} pattern="(\+?\d[- .]*){7,13}" validate type='text' label='Phone +380503332211' />

                            <Input id='one' className='ative' validate pattern="true||false" m={6} l={6} s={12} ref={(input) => { this.Gender = input; }} type='select' label='Gender' icon='wc' defaultValue='true'>
                                    <option value='true'>Man</option>
                                    <option value='false'>Women</option>    
                            </Input>
                            <Input className='input_refresh' s={12} m={6} l={6} ref={(input) => { this.Age = input; }} pattern="[0-9]{2}" validate type='text' label='Age ' />
                            <Button  s={12} m={6} l={6} className='button_form_body' onClick={this.submit_form_body.bind(this)}  >Submit</Button>
                        </form >
                        <Table s={12} m={12} l={12}>
                                    <thead>
                                        <tr>
                                            <th data-field="name">First Name</th>
                                            <th data-field="price">Last Name</th>
                                            <th data-field="Phone">Phone</th>
                                            <th data-field="Gender"><Button icon='wc' onClick={this.source_m_w.bind(this)}>{this.state.search_m_w}</Button></th>
                                            <th data-field="Age"><Button onClick={this.age_source.bind(this)}>{this.state.up_down}</Button></th>
                                            <th data-field="Delet">Delet</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tr_element}
                                    </tbody>
                                </Table>
                        </Row>
                </div>
                )
        }
    }
    module.exports = Form_body;