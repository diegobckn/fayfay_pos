/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */

import React, { useState, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,

  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  DialogTitle,
  Grid,
  Typography,
  TextField,
  Paper
} from "@mui/material";
import SmallButton from "../Elements/SmallButton";
import System from "../../Helpers/System";
import TecladoPrecio from "../Teclados/TecladoPrecio";
import IngresarTexto from "./IngresarTexto";
import BalanzaDigi from "../../Models/BalanzaDigi";
import Product from "../../Models/Product";

import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import ProductSold from "../../Models/ProductSold";
import TableItemTicketDigi from "../BoxOptionsLite/TableItemTicketDigi";
import TableListItemsTicketDigi from "../BoxOptionsLite/TableListItemsTicketDigi";

const LeerValeDigi = ({
  openDialog,
  setOpenDialog,
  product,
  onAsignPrice
}) => {

  const {
    addToSalesData,
    userData,
    salesData,
    grandTotal,
    setSelectedUser,
    setTextSearchProducts,
    clearSalesData,

    cliente,
    setCliente,
    setAskLastSale,
    showMessage,
    showLoading,
    hideLoading,
    setShowDialogSelectClient,
    modoAvion,
    showAlert,
    setUltimoVuelto,
    sales,
    setSolicitaRetiro,
    showConfirm,
    setListSalesOffline,
    createQrString,
  } = useContext(SelectedOptionsContext);


  const [verIngresoTicket, setVerIngresoTicket] = useState(false)
  const [valorTicket, setValorTicket] = useState("")

  const [infoBalanza, setInfoBalanza] = useState(null)
  const [productos, setProductos] = useState([])

  const [total, setTotal] = useState(0)

  const balanza = new BalanzaDigi()

  const handlerSaveAction = () => {
    setOpenDialog(false)
  }

  useEffect(() => {
    if (!openDialog) return
    setProductos([])
    setTotal(0)
    setValorTicket("")

    balanza.estadoVales((res) => {
      console.log("res", res)
      if (res.status) {
        setInfoBalanza(res.info.info51)
      }
    })
  }, [openDialog])

  useEffect(() => {
    console.log("infoBalanza", infoBalanza)
  }, [infoBalanza])

  useEffect(() => {
    console.log("valorTicket", valorTicket)
  }, [valorTicket])

  const hacerCarga = () => {

    const nroValeTicket = valorTicket.substring(2, 6)
    const coinciden = []

    const hay = infoBalanza.length
    var va = 0
    var totalProds = 0

    const revisarSiTermino = () => {
      if (va == hay) {
        setProductos(coinciden)
        console.log("coinciden", coinciden)
        setTotal(totalProds)
      }
    }

    console.log("infoBalanza", infoBalanza)
    console.log("hay", hay)
    console.log("nroValeTicket", nroValeTicket)
    infoBalanza.forEach((item) => {
      console.log("item.nroVale", item.nroVale)
      if (item.nroVale == nroValeTicket || item.nroVale == valorTicket) {
        console.log("coincide")
        // coinciden.push(item)

        Product.getInstance().findByCodigoBarras({
          codigoProducto: parseInt(item.pluItem)
        }, (prods) => {

          if (prods.length > 0) {
            const prod = new ProductSold()
            prod.fill(prods[0])
            prod.cantidad = parseFloat(item.pesoItem) / 1000
            prod.updateSubtotal()
            prod.total = parseFloat(item.precioTotalItem)
            coinciden.push(prod)
            totalProds += prod.total
          }
          va++
          revisarSiTermino()
        }, (er) => {
          va++
          revisarSiTermino()
          showAlert(er)
        })
      } else {
        console.log("no coincide")
        va++
        revisarSiTermino()
      }
    })

    console.log("coinciden", coinciden)

  }

  const quitar = (ix) => {

    var prods = System.clone(productos.filter((pr, ind) => ind != ix))
    setProductos([])

    var ttal = 0

    prods.forEach((prod) => {
      ttal += prod.total
    })

    setTimeout(() => {
      setProductos(prods)
      setTotal(ttal)
    }, 300);
  }


  const confirmar = () => {
    productos.forEach((item) => {
      addToSalesData(item)
    })

    setProductos([])
    setOpenDialog(false)
  }

  return (
    <Dialog
      open={openDialog} onClose={() => { }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Leer captura vale Digi 300
      </DialogTitle>
      <DialogContent>

        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12} lg={12}>
            <Typography variant="body4" color="black">

            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <TextField
              fullWidth
              placeholder="Lectura de vale"
              value={valorTicket}
              onChange={(e) => setValorTicket(e.target.value)}
              sx={{
                backgroundColor: "white",
                borderRadius: "5px",
                margin: "1px",
              }}
              onClick={() => {
                setVerIngresoTicket(true)
              }}
              onKeyDown={(e) => {
                // if (e.keyCode == 13) {
                //   handleSearch()
                // }
              }}
            />

            <IngresarTexto
              title="Lectura de vale"
              openDialog={verIngresoTicket}
              setOpenDialog={setVerIngresoTicket}
              varChanger={setValorTicket}
              varValue={valorTicket}
              onEnter={() => {

              }}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5}>
            <SmallButton
              style={{
                height: "52px",
                position: "relative",
                top: "-3px",
              }}
              textButton={"Buscar"}
              actionButton={() => {
                hacerCarga()
              }} />

          </Grid>

          <TableListItemsTicketDigi listadoItems={productos} />

          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Typography>Total ${System.formatMonedaLocal(total, false)}</Typography>
          </Grid>

        </Grid>

      </DialogContent>
      <DialogActions>

        {productos.length > 0 && (
          <SmallButton
            style={{
              width: "inherit",
              height: "55px"
            }}
            textButton={"Confirmar y agregar productos"} actionButton={() => {
              confirmar()
            }} />
        )}

        <Button onClick={() => {
          setOpenDialog(false)
        }}>Volver</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeerValeDigi;
