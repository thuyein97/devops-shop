{{- define "devops-shop.name" -}}
{{- .Chart.Name -}}
{{- end }}

{{- define "devops-shop.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Chart label helper
*/}}
{{- define "devops-shop.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "devops-shop.selectorLabels" -}}
app.kubernetes.io/name: {{ include "devops-shop.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "devops-shop.labels" -}}
helm.sh/chart: {{ include "devops-shop.chart" . }}
{{ include "devops-shop.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}