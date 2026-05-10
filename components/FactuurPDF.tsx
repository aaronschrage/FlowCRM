import React from "react";
import { Document, Page, Text, View, StyleSheet, type DocumentProps } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, padding: 48, backgroundColor: "#ffffff", color: "#1a1a2e" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 40 },
  logo: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#34d399" },
  bedrijfInfo: { textAlign: "right", color: "#6b7280", lineHeight: 1.6, fontSize: 9 },
  factuurInfo: { flexDirection: "row", justifyContent: "space-between", marginBottom: 32, padding: 20, backgroundColor: "#f0fdf4", borderRadius: 8 },
  infoBlok: { flex: 1 },
  infoLabel: { fontSize: 8, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  infoWaarde: { fontSize: 11, color: "#1a1a2e", fontFamily: "Helvetica-Bold" },
  infoSub: { fontSize: 9, color: "#6b7280", marginTop: 2 },
  tabelHeader: { flexDirection: "row", backgroundColor: "#34d399", padding: "10 12", borderRadius: 4, marginBottom: 2 },
  tabelHeaderText: { color: "#ffffff", fontSize: 8, fontFamily: "Helvetica-Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  tabelRij: { flexDirection: "row", padding: "10 12", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  tabelRijAlt: { flexDirection: "row", padding: "10 12", backgroundColor: "#fafafa", borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  colOmschrijving: { flex: 3 },
  colAantal: { flex: 1, textAlign: "right" },
  colPrijs: { flex: 1, textAlign: "right" },
  colBtw: { flex: 1, textAlign: "center" },
  colTotaal: { flex: 1, textAlign: "right" },
  totaalBlok: { marginTop: 20, marginLeft: "auto", width: 220 },
  totaalRij: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  totaalLabel: { color: "#6b7280", fontSize: 10 },
  totaalWaarde: { color: "#1a1a2e", fontSize: 10 },
  totaalDivider: { borderTopWidth: 1, borderTopColor: "#e5e7eb", marginVertical: 6 },
  totaalGroot: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  totaalGrootLabel: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1a1a2e" },
  totaalGrootWaarde: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#34d399" },
  betaalInfo: { marginTop: 24, padding: 16, backgroundColor: "#f0fdf4", borderRadius: 6, borderLeftWidth: 3, borderLeftColor: "#34d399" },
  betaalLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#065f46", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 },
  betaalTekst: { fontSize: 10, color: "#047857", lineHeight: 1.5 },
  footer: { position: "absolute", bottom: 32, left: 48, right: 48, borderTopWidth: 1, borderTopColor: "#f0f0f0", paddingTop: 12 },
  footerRij: { flexDirection: "row", justifyContent: "space-between", color: "#9ca3af", fontSize: 8 },
  footerExtra: { flexDirection: "row", justifyContent: "center", gap: 20, marginTop: 4, color: "#9ca3af", fontSize: 8 },
});

const fmt = (n: number) =>
  new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

interface FactuurPDFProps {
  factuur: any;
  bedrijfsnaam?: string;
  bedrijfEmail?: string;
  bedrijfTelefoon?: string;
  bedrijfAdres?: string;
  bedrijfWebsite?: string;
  kvk?: string;
  btwnummer?: string;
  iban?: string;
}

export function createFactuurPDFElement(
  props: FactuurPDFProps,
): React.ReactElement<DocumentProps> {
  // Safe cast: FactuurPDF renders <Document> as its root, satisfying renderToBuffer's type.
  return React.createElement(FactuurPDF, props) as React.ReactElement<DocumentProps>;
}

export default function FactuurPDF({
  factuur,
  bedrijfsnaam = "Mijn Bedrijf",
  bedrijfEmail = "",
  bedrijfTelefoon = "",
  bedrijfAdres = "",
  bedrijfWebsite = "",
  kvk = "",
  btwnummer = "",
  iban = "",
}: FactuurPDFProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>{bedrijfsnaam}</Text>
            <Text style={{ color: "#6b7280", marginTop: 4, fontSize: 9 }}>Factuur</Text>
            {bedrijfAdres ? <Text style={{ color: "#9ca3af", marginTop: 2, fontSize: 8 }}>{bedrijfAdres}</Text> : null}
          </View>
          <View style={styles.bedrijfInfo}>
            {bedrijfEmail ? <Text>{bedrijfEmail}</Text> : null}
            {bedrijfTelefoon ? <Text>{bedrijfTelefoon}</Text> : null}
            {bedrijfWebsite ? <Text>{bedrijfWebsite}</Text> : null}
            {kvk ? <Text>KvK: {kvk}</Text> : null}
            {btwnummer ? <Text>BTW: {btwnummer}</Text> : null}
          </View>
        </View>

        <View style={styles.factuurInfo}>
          <View style={styles.infoBlok}>
            <Text style={styles.infoLabel}>Factuurnummer</Text>
            <Text style={styles.infoWaarde}>{factuur.nummer}</Text>
          </View>
          <View style={styles.infoBlok}>
            <Text style={styles.infoLabel}>Klant</Text>
            <Text style={styles.infoWaarde}>{factuur.klant.name}</Text>
            <Text style={styles.infoSub}>{factuur.klant.email}</Text>
          </View>
          <View style={styles.infoBlok}>
            <Text style={styles.infoLabel}>Factuurdatum</Text>
            <Text style={styles.infoWaarde}>{new Date(factuur.datum).toLocaleDateString("nl-NL")}</Text>
          </View>
          <View style={styles.infoBlok}>
            <Text style={styles.infoLabel}>Vervaldatum</Text>
            <Text style={styles.infoWaarde}>{new Date(factuur.vervaldatum).toLocaleDateString("nl-NL")}</Text>
          </View>
        </View>

        <View style={styles.tabelHeader}>
          <Text style={[styles.tabelHeaderText, styles.colOmschrijving]}>Omschrijving</Text>
          <Text style={[styles.tabelHeaderText, styles.colAantal]}>Aantal</Text>
          <Text style={[styles.tabelHeaderText, styles.colPrijs]}>Prijs</Text>
          <Text style={[styles.tabelHeaderText, styles.colBtw]}>BTW</Text>
          <Text style={[styles.tabelHeaderText, styles.colTotaal]}>Totaal</Text>
        </View>

        {factuur.regels.map((regel: any, i: number) => (
          <View key={regel.id} style={i % 2 === 0 ? styles.tabelRij : styles.tabelRijAlt}>
            <Text style={styles.colOmschrijving}>{regel.omschrijving}</Text>
            <Text style={styles.colAantal}>{regel.aantal}</Text>
            <Text style={styles.colPrijs}>{fmt(regel.eenheidsprijs)}</Text>
            <Text style={styles.colBtw}>{regel.btw}%</Text>
            <Text style={styles.colTotaal}>{fmt(regel.totaal)}</Text>
          </View>
        ))}

        <View style={styles.totaalBlok}>
          <View style={styles.totaalRij}>
            <Text style={styles.totaalLabel}>Subtotaal</Text>
            <Text style={styles.totaalWaarde}>{fmt(factuur.subtotaal)}</Text>
          </View>
          <View style={styles.totaalRij}>
            <Text style={styles.totaalLabel}>BTW</Text>
            <Text style={styles.totaalWaarde}>{fmt(factuur.btwBedrag)}</Text>
          </View>
          <View style={styles.totaalDivider} />
          <View style={styles.totaalGroot}>
            <Text style={styles.totaalGrootLabel}>Totaal</Text>
            <Text style={styles.totaalGrootWaarde}>{fmt(factuur.totaal)}</Text>
          </View>
        </View>

        <View style={styles.betaalInfo}>
          <Text style={styles.betaalLabel}>Betaalinformatie</Text>
          <Text style={styles.betaalTekst}>
            Gelieve het bedrag van {fmt(factuur.totaal)} over te maken voor {new Date(factuur.vervaldatum).toLocaleDateString("nl-NL")} onder vermelding van {factuur.nummer}.
            {iban ? `\nIBAN: ${iban}` : ""}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.footerRij}>
            <Text>{bedrijfsnaam}</Text>
            <Text>{factuur.nummer}</Text>
            <Text>Gegenereerd op {new Date().toLocaleDateString("nl-NL")}</Text>
          </View>
          {(iban || kvk || btwnummer) ? (
            <View style={styles.footerExtra}>
              {iban ? <Text>IBAN: {iban}</Text> : null}
              {kvk ? <Text>KvK: {kvk}</Text> : null}
              {btwnummer ? <Text>BTW: {btwnummer}</Text> : null}
            </View>
          ) : null}
        </View>
      </Page>
    </Document>
  );
}