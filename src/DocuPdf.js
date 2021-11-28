import React from 'react';
import { Document, Page, Text, View } from "@react-pdf/renderer";

const viewPDF = ({ empleado }) => {
    return (
        <Document>
            <Page size="A4">
                <View>
                    <Text>{empleado? empleado.nombre:".."} </Text>
                </View>
            </Page>

        </Document>
    );
};

export default viewPDF;