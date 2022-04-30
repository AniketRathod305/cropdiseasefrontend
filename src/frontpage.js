import { useState, useEffect } from "react";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import { DropzoneArea } from 'material-ui-dropzone';
import Typography from "@material-ui/core/Typography";
import axios from 'axios'
import { makeStyles, withStyles } from "@material-ui/core/styles"
import Clear from '@material-ui/icons/Clear';

import { common } from '@material-ui/core/colors';


const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);
const useStyles = makeStyles((theme) => ({
  imageCard: {
    margin: "auto",
    maxWidth: 400,
    height: 500,
    backgroundColor: 'transparent',
    boxShadow: '0px 9px 70px 0px rgb(0 0 0 / 30%) !important',
    borderRadius: '15px',
  },
  imageCardEmpty: {
    height: 'auto',
  },
  media: {
    height: 400,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  }

}));

export const UploadImage=()=>{

  const classes = useStyles();
  const [selectedFile,setSelectedFile]=useState()
  const [preview,setPreview]=useState()
  const [data,setData]=useState()
  const [image,setImage]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  let confidence;

  const sendFile=async()=>{

    if(image){
        let formdata=new FormData()
        formdata.append("file",selectedFile)
        let res=await axios({
          method:"post",
          url:'http://localhost:8000/predict',
          data:formdata
        })
        console.log(res)

        if(res.status===200){
          setData(res.data)
        }

        setIsLoading(false)
      }
    }


  const clearData = () => {

      setData(null);
      setImage(false);
      setSelectedFile(null);
      setPreview(null);
    };

    useEffect(() => {
      if (!selectedFile) {
        setPreview(undefined);
        return;
      }
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }, [selectedFile]);
  
    useEffect(() => {
      if (!preview) {
        return;
      }
      setIsLoading(true);
      sendFile();
    }, [preview]);
  
    const onSelectFile = (files) => {
      if (!files || files.length === 0) {
        setSelectedFile(undefined);
        setImage(false);
        setData(undefined);
        return;
      }
      setSelectedFile(files[0]);
      setData(undefined);
      setImage(true);
    };
  
    if (data) {
      confidence = (parseFloat(data.confidence) * 100).toFixed(2);
    }


    return (
    <React.Fragment>
    <Container maxWidth={false} >
        <Grid 
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >

            <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`} >
              {image && <CardActionArea>
                <CardMedia
                  className={classes.media}
                  image={preview}
                  component="image"
                  title="Contemplative Reptile"
                />
              </CardActionArea>
              }
              {!image && <CardContent >
                <DropzoneArea                                                                                                    
                  acceptedFiles={['image/*']}
                  dropzoneText={"Drag and drop an image of a tomato plant leaf to process"}
                  onChange={onSelectFile}
                />
              </CardContent>}
              {data && <CardContent >
                <TableContainer component={Paper}>
                  <Table size="small" aria-label="simple table">
                    <TableHead >
                      <TableRow >
                        <TableCell >Label:</TableCell>
                        {/*<TableCell align="right">Confidence:</TableCell>*/}
                      </TableRow>
                    </TableHead>
                    <TableBody >
                      <TableRow >
                        <TableCell component="th" scope="row" >
                          {data.class}
                        </TableCell>
                        {/*<TableCell align="right">{confidence}%</TableCell>*/}
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>}
              {isLoading && <CardContent >
                <CircularProgress color="secondary"  />
                <Typography  variant="h6" noWrap>
                  Processing
                </Typography>
              </CardContent>}
            </Card>
          </Grid>

        

        {data &&
            <Grid item  >

              <ColorButton variant="contained"  color="primary" component="span" size="large" onClick={clearData} startIcon={<Clear fontSize="large" /> }  className="abc">
                Clear
        </ColorButton>
            </Grid>}
            </Grid>

            </Container>
    </React.Fragment >
 
    )

}
