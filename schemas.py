from typing import Literal
from pydantic import BaseModel, Field


class ClienteInput(BaseModel):
    id_cliente: str = Field(min_length=1, max_length=30)
    edad: int = Field(gt=0, le=120)
    ingresos_anuales: float = Field(gt=0)
    saldo_cuenta: float = Field(ge=0)
    num_productos: int = Field(ge=1, le=4)
    antiguedad_meses: int = Field(ge=0)
    tiene_tarjeta: int = Field(default=0, ge=0, le=1)
    tipo_cuenta: Literal["Corriente", "Ahorro", "Nomina", "Inversion"]
    canal_preferido: Literal["App Movil", "Cajero Antiguo", "Oficina", "Telefono", "Web"]
    nivel_estudios: Literal["Primaria", "Secundaria", "Grado", "Master", "Doctorado"]
    nivel_satisfaccion: Literal["Muy Bajo", "Bajo", "Medio", "Alto", "Muy Alto"]


class PrediccionOutput(BaseModel):
    id_cliente: str
    abandono: int = Field(ge=0, le=1)
    probabilidad_abandono: float = Field(ge=0.0, le=1.0)
    nivel_riesgo: Literal["Bajo", "Medio", "Alto"]
    accion_recomendada: str