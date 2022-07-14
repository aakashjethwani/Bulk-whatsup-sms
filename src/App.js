import logo from './logo.svg';
import './App.css';
import readXlsxFile from 'read-excel-file'
import { useState } from 'react';
import axios from 'axios';

function App() {
  let excelSheet = [];
  let sentReqeust = []
  const [contactDetail ,setcontactDetail]= useState({
    name:'',phoneno:''
  })
  const [id, setId]  = useState("");
  const [auth, setAuth] = useState("");
  const [sendreq, setSendreq] = useState([])
  const sendMessage =  async (name, phoneNo)=>{
    console.log("first 2 char"+ phoneNo.substr(0,2)) ;
    let phoneNumber = '';
    if(phoneNo.substr(0,2) === '91'){
      phoneNumber = phoneNo;
    }else if(phoneNo.substr(0,3)==='+91')
    {
      phoneNumber = phoneNo.substr(1)
    }else {
      phoneNumber = '91' + parseInt(phoneNo,10);
    }
    
    console.log("phone no is "  + phoneNumber);

    await axios.post(`https://graph.facebook.com/v13.0/${id}/messages`, `{ "messaging_product": "whatsapp", "to": ${phoneNumber}, "type": "template", "template": { "name": "ebook", "language": { "code": "en" },"components": [
      {
          "type": "header",
          "parameters": [
              {
                  "type": "image",
                  "image": {
                    "id": "2020467871469712"
                  }
              }
          ]
      }] } }` , {
          headers: {'Authorization': `Bearer ${auth}`,'Content-Type': 'application/json'}
        }).then((res)=>{
          console.log("Response " + res.data)
          
          
        },(err)=>{
          console.log("Error" + err)
        })
  }
  
  const onchange = async (e)=>{
    console.log(e)
    const [file] = e.target.files;
    readXlsxFile(file).then((rows)=>{
     rows.map((row)=>{
      
     sendMessage(row[0],row[1]).then(
      ()=>{
        console.log(row[0])
        setSendreq((pre)=>[...pre,{"name":row[0],"phoneNo":row[1]}])
      }
      
      
     )
      excelSheet.push(row);
     })
     console.log(sendreq);

      })

      
  }
  excelSheet.map((data)=>{
    console.log("Array data" + data)
  } )
  return (
    <div className='main-container'>
      <div className='input-container'>
          <div className='group-input'>
            <div className='label'> Enter id</div>
            <input type="text" required onChange={(e)=>{setId(e.target.value)}}></input>
          </div>
          <div className='group-input'>
            <div className='label'> Enter Authentication Key</div>
            <input type="text" required onChange={(e)=>{setAuth(e.target.value)}}></input>
          </div>
          <div className='group-input'>
            <div className='label'> Select Excel file </div>
            <input type='file' onChange={onchange}></input>
          </div>
          <div className='group-input'>
            <button type='submit'>Send </button>
          </div>
      </div>

      
      <table className='tbl'>
        <tr>
          <th>S.NO</th>
          <th>Name</th>
          <th>Phone NO</th>
          <th>Status</th>
          <th>Send Again</th>
        </tr>
        
      
      {
        sendreq.map((row,index)=>{
          return <tr key={index}>
            <td > {index} </td>
            <td >  {row.name} </td>
            <td >  {row.phoneNo} </td>
            <td > Message Sent </td>
            <td > <input type="checkedbox"></input> </td>
            </tr>
        })
      }
      </table>

    </div>
  );
}

export default App;
