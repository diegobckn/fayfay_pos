import React, { useState, useContext, useEffect } from "react";

import {
  Paper,
  Grid,
  Box,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  Checkbox,
} from "@mui/material";
import { SelectedOptionsContext } from "../Context/SelectedOptionsProvider";
import BoxAdminAppTurno from "./BoxAdminAppTurno";
import BoxAdminAppPedidos from "./BoxAdminAppPedidos";
import System from "../../Helpers/System";
import SmallButton from "../Elements/SmallButton";
import Product from "../../Models/Product";


export default ({
  itemTicketDigi
}) => {
  const {
    userData,
    salesData,
    clearSessionData,
    clearSalesData,
    getUserData,
    setShowLoadingDialogWithTitle,
    showLoading,
    hideLoading,
    setShowLoadingDialog,
    showConfirm,
    showMessage,
    showAlert,

    suspenderYRecuperar,
    listSalesOffline,
    setListSalesOffline
  } = useContext(SelectedOptionsContext);

  const [info, setInfo] = useState(null)

  useEffect(() => {
    console.log("cambio algo de itemTicketDigi", itemTicketDigi)

    if (itemTicketDigi) {
      Product.getInstance().findByCodigoBarras({
        codigoProducto: parseInt(itemTicketDigi.pluItem)
      }, (prods) => {

        if (prods.length > 0) {
          const prod = new ProductSold()
          prod.fill(prods[0])
          prod.cantidad = parseFloat(item.pesoItem) / 1000
          prod.updateSubtotal()
          prod.total = parseFloat(item.precioTotalItem)
          setInfo(prod)

        }
      }, (er) => {
        showAlert(er)
      })
    }
  }, [itemTicketDigi])

  return (!info ? null : (
    <TableRow>
      <TableCell sx={{
        textAlign: "center"
      }}>{parseInt(info.idProducto)}</TableCell>
      <TableCell>{info.nombre}</TableCell>
      <TableCell>${System.formatMonedaLocal(info.precioVenta, false)}</TableCell>
      <TableCell>{info.cantidad}</TableCell>
      <TableCell>${System.formatMonedaLocal(info.total, false)}</TableCell>
      <TableCell>
        {/* <SmallButton textButton={"Quitar"} actionButton={() => {
          quitar(ix)
        }} /> */}
      </TableCell>
    </TableRow>
  )
  );
};

