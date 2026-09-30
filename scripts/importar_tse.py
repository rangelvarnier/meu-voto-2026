"""Baixa a base oficial de candidatos 2026 do TSE e gera src/data/tse.json.

Uso:  python3 scripts/importar_tse.py [UF]      (padrão: SC)

Só exporta campos públicos úteis ao app (nada de CPF, e-mail ou título).
Fonte: https://dadosabertos.tse.jus.br/dataset/candidatos-2026
"""
import csv
import io
import json
import sys
import urllib.request
import zipfile
from datetime import date
from pathlib import Path

BASE = "https://cdn.tse.jus.br/estatistica/sead/odsele"
URL = f"{BASE}/consulta_cand/consulta_cand_2026.zip"
URL_COMPL = f"{BASE}/consulta_cand_complementar/consulta_cand_complementar_2026.zip"
URL_HIST = f"{BASE}/historico_candidatura/historico_candidatura_2026.zip"
UF = (sys.argv[1] if len(sys.argv) > 1 else "SC").upper()
SAIDA = Path(__file__).resolve().parent.parent / "src" / "data" / "tse.json"

CARGOS = {
    "PRESIDENTE": "presidente",
    "GOVERNADOR": "governador",
    "SENADOR": "senador",
    "DEPUTADO FEDERAL": "deputado_federal",
    "DEPUTADO ESTADUAL": "deputado_estadual",
}
VICES = {"VICE-PRESIDENTE": "presidente", "VICE-GOVERNADOR": "governador"}


def ler(zf: zipfile.ZipFile, nome: str):
    with zf.open(nome) as f:
        yield from csv.DictReader(io.TextIOWrapper(f, encoding="latin1"), delimiter=";")


def titulo(s: str) -> str:
    minusc = {"de", "da", "do", "das", "dos", "e"}
    return " ".join(p if p.lower() in minusc else p.capitalize() for p in s.lower().split())


def baixar(url: str) -> zipfile.ZipFile:
    print(f"Baixando {url} …")
    return zipfile.ZipFile(io.BytesIO(urllib.request.urlopen(url, timeout=180).read()))


def nascimentos(uf: str) -> dict:
    """SQ_CANDIDATO -> cidade de nascimento (arquivo complementar do TSE)."""
    zf = baixar(URL_COMPL)
    out = {}
    for arquivo in ("consulta_cand_complementar_2026_BR.csv", f"consulta_cand_complementar_2026_{uf}.csv"):
        for r in ler(zf, arquivo):
            cidade = r["NM_MUNICIPIO_NASCIMENTO"]
            if cidade and not cidade.startswith("#"):
                out[r["SQ_CANDIDATO"]] = titulo(cidade)
    return out


def disputas_municipais(uf: str) -> dict:
    """SQ_CANDIDATO -> eleições municipais anteriores (cargo, ano, cidade, resultado).

    O TSE não publica o domicílio eleitoral em dados abertos; as cidades onde a pessoa
    já concorreu a vereador, prefeito ou vice são o melhor indício público de base local.
    """
    zf = baixar(URL_HIST)
    out: dict = {}
    for r in ler(zf, f"historico_candidatura_2026_{uf}.csv"):
        if r["TP_ABRANGENCIA_ELEICAO"] != "M" or r["ANO_ELEICAO"] == "2026":
            continue
        resultado = r["DS_SIT_TOT_TURNO"]
        out.setdefault(r["SQ_CANDIDATO_ATUAL"], []).append({
            "ano": int(r["ANO_ELEICAO"]),
            "cargo": titulo(r["DS_CARGO"]),
            "cidade": titulo(r["NM_UE"]),
            "resultado": "" if resultado.startswith("#") else resultado,
        })
    for lista in out.values():
        lista.sort(key=lambda d: -d["ano"])
    return out


def main():
    zf = baixar(URL)
    nasc = nascimentos(UF)
    disputas = disputas_municipais(UF)

    candidatos, vices = [], {}
    for arquivo in (f"consulta_cand_2026_BR.csv", f"consulta_cand_2026_{UF}.csv"):
        for r in ler(zf, arquivo):
            cargo = r["DS_CARGO"]
            if cargo in VICES:
                # Substituições reaproveitam o número; guardamos todos os vices do número
                vices.setdefault((VICES[cargo], r["NR_CANDIDATO"]), []).append(titulo(r["NM_URNA_CANDIDATO"]))
                continue
            if cargo not in CARGOS:
                continue
            candidatos.append({
                "sq": r["SQ_CANDIDATO"],
                "cargo": CARGOS[cargo],
                "numero": r["NR_CANDIDATO"],
                "nome": titulo(r["NM_URNA_CANDIDATO"]),
                "nomeCompleto": titulo(r["NM_CANDIDATO"]),
                "partido": r["SG_PARTIDO"],
                "federacao": r["SG_FEDERACAO"] if r["SG_FEDERACAO"] not in ("#NULO", "#NE") else None,
                "coligacao": r["NM_COLIGACAO"].strip(),
                "composicao": r["DS_COMPOSICAO_COLIGACAO"],
                "ocupacao": titulo(r["DS_OCUPACAO"]),
                "genero": titulo(r["DS_GENERO"]),
                "situacao": r["DS_SITUACAO_CANDIDATURA"],
            })

    for c in candidatos:
        if c["sq"] in nasc:
            c["nascimento"] = nasc[c["sq"]]
        if c["sq"] in disputas:
            c["disputas"] = disputas[c["sq"]]
        # Um candidato substituto pode ter sido vice do titular original: descarta o próprio nome
        opcoes = [v for v in vices.get((c["cargo"], c["numero"]), []) if v != c["nome"]]
        if opcoes:
            c["vice"] = opcoes[-1]

    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    SAIDA.write_text(json.dumps({
        "uf": UF,
        "geradoEm": date.today().isoformat(),
        "fonte": "https://dadosabertos.tse.jus.br/dataset/candidatos-2026",
        "candidatos": candidatos,
    }, ensure_ascii=False, indent=1))
    por_cargo = {}
    for c in candidatos:
        por_cargo[c["cargo"]] = por_cargo.get(c["cargo"], 0) + 1
    print(f"OK → {SAIDA}  {por_cargo}")


if __name__ == "__main__":
    main()
