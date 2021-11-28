import React, { Component } from 'react'
import './App.css';


import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faInfo, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import { viewPDF } from "./DocuPdf.js";
import { PDFViewer } from "@react-pdf/renderer";
import { Document, Page, Text, View } from "@react-pdf/renderer";
const url = "http://localhost:3000/";

class App extends Component {
  state = {
    data: [],
    modalInsertar: false,
    modalEliminar: false,
    form: {
      id_empleado: '',
      nombre: '',
      email: '',
      into_fecha: '',
      tipoModal: ''
    }
  }

  peticionGet = () => {
    axios.get(url).then(response => {
      this.setState({ data: response.data });
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPost = async () => {
    delete this.state.form.id;
    await axios.post(url, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    }).catch(error => {
      console.log(error.message);
    })
  }

  peticionPut = () => {
    axios.put(url + this.state.form.id_empleado, this.state.form).then(response => {
      this.modalInsertar();
      this.peticionGet();
    })
  }

  peticionDelete = () => {
    axios.delete(url + this.state.form.id_empleado).then(response => {
      this.setState({ modalEliminar: false });
      this.peticionGet();
    })
  }

  modalInsertar = () => {
    this.setState({ modalInsertar: !this.state.modalInsertar });
  }
  modalPDF = () => {
    this.setState({ modalPDF: !this.state.modalPDF });
  }

  seleccionarEmpresa = (empleado) => {
    this.setState({
      tipoModal: 'actualizar',
      form: {
        id_empleado: empleado.id_empleado,
        nombre: empleado.nombre,
        email: empleado.email,
        into_fecha: empleado.into_fecha
      }
    })
  }

  handleChange = async e => {
    e.persist();
    await this.setState({
      form: {
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  componentDidMount() {
    this.peticionGet();
  }


  render() {
    const { form } = this.state;
    return (
      <div className="App">
        <br /><br /><br />
        <button className="btn btn-success" onClick={() => { this.setState({ form: null, tipoModal: 'insertar' }); this.modalInsertar() }}>Agregar Empleado</button>
        <br /><br />
        <table className="table ">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Fecha de Ingreso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map(empleado => {
              return (
                <tr>
                  <td>{empleado.id_empleado}</td>
                  <td>{empleado.nombre}</td>
                  <td>{empleado.email}</td>
                  <td>{empleado.into_fecha}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => { this.seleccionarEmpresa(empleado); this.modalInsertar() }}><FontAwesomeIcon icon={faEdit} /></button>
                    {"   "}
                    <button className="btn btn-danger" onClick={() => { this.seleccionarEmpresa(empleado); this.setState({ modalEliminar: true }) }}><FontAwesomeIcon icon={faTrashAlt} /></button>
                    {"   "}
                    <button className="btn btn-info" onClick={() => { this.seleccionarEmpresa(empleado); this.modalPDF() }}><FontAwesomeIcon icon={faInfo} /></button>
                    {"   "}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>



        <Modal isOpen={this.state.modalInsertar}>
          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalInsertar()}>x</span>
          </ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="id">ID</label>
              <input className="form-control" type="text" name="id" id="id" readOnly onChange={this.handleChange} value={form ? form.id_empleado : ''} />
              <br />
              <label htmlFor="nombre">Nombre</label>
              <input className="form-control" type="text" name="nombre" id="nombre" onChange={this.handleChange} value={form ? form.nombre : ''} />
              <br />
              <label htmlFor="nombre">Email</label>
              <input className="form-control" type="text" name="email" id="email" onChange={this.handleChange} value={form ? form.email : ''} />
              <br />
              <label htmlFor="capital_bursatil">Fecha de ingreso</label>
              <input className="form-control" type="text" name="into_fecha" id="into_fecha" onChange={this.handleChange} value={form ? form.into_fecha : ''} />
            </div>
          </ModalBody>

          <ModalFooter>
            {this.state.tipoModal == 'insertar' ?
              <button className="btn btn-success" onClick={() => this.peticionPost()}>
                Insertar
              </button> : <button className="btn btn-primary" onClick={() => this.peticionPut()}>
                Actualizar
              </button>
            }
            <button className="btn btn-danger" onClick={() => this.modalInsertar()}>Cancelar</button>
          </ModalFooter>
        </Modal>


        <Modal isOpen={this.state.modalEliminar}>
          <ModalBody>
            Estás seguro que deseas eliminar al empleado {form && form.nombre}
          </ModalBody>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.peticionDelete()}>Sí</button>
            <button className="btn btn-secundary" onClick={() => this.setState({ modalEliminar: false })}>No</button>
          </ModalFooter>
        </Modal>

        <Modal style={{ width: "100%", height: "100%" }} isOpen={this.state.modalPDF}>

          <ModalHeader style={{ display: 'block' }}>
            <span style={{ float: 'right' }} onClick={() => this.modalPDF()}>x</span>
          </ModalHeader>
          <ModalBody>

            <PDFViewer style={{ width: "100%", height: "90vh" }}>
              <Document>
                <Page size="A4">
                <Text style={{ fontSize: "15px", textAlign:"right", paddingBottom:"20px"}}> Merida, Yucatan, a 25 de Noviembre del 2021</Text>
                  <View style={{ textAlign: 'justify' }}>
                    
                    <Text style={{ fontSize: "20px", paddingBottom: "30px" }}>A QUIEN CORRESPONDA: </Text>
                    <Text style={{ fontSize: "20px", paddingBottom: "30px" }}>
                      Por medio de la presente y para los fines que pretenda el interesado, hago de

                      su conocimiento que recomiendo ampliamente al C. {form ? form.nombre : ''} , ya que es una persona

                      Honesta y Responsable en las activdades que durante el periodo que prestó servicios en nuestra

                      empresa le fueran asignadas, por tal motivo no tengo ninguna duda en expedir esta recomendación.</Text>
                    <Text style={{ fontSize: "20px", paddingBottom: "160px" }}>Se extiende la presente solicitud del interesado y para los fines que juzgue convenientes.</Text>
                    
                  </View>
                  <View style={{ fontSize: "20px", paddingBottom: "30px", textAlign:"center"}}>
                    <Text style={{ fontSize: "20px", paddingBottom: "30px" }}>___________________________</Text>
                    <Text style={{ fontSize: "20px", paddingBottom: "30px" }}>Ing. David Cano Kú </Text>
                    <Text style={{ fontSize: "20px", paddingBottom: "30px" }}>Lletrox Company C.A de C.V.</Text>
                  </View>
                  

                </Page>

              </Document>
            </PDFViewer>
          </ModalBody>

          <ModalFooter>
            <button className="btn btn-danger" onClick={() => this.modalPDF()}>Cancelar</button>
          </ModalFooter>
        </Modal>
      </div>



    );
  }
}
export default App;
