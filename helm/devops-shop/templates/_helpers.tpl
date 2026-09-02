{{- define "devops-shop.name" -}}
{{- .Chart.Name -}}
{{- end }}

{{- define "devops-shop.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" -}}
{{- end }}
