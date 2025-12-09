from django.shortcuts import render, redirect
from django.utils import timezone
from .models import Transacao
from django import forms
from decimal import Decimal

class TransacaoForm(forms.ModelForm):
    class Meta:
        model = Transacao
        fields = ['tipo', 'descricao', 'valor', 'data', 'categoria']


def dashboard(request):
    transacoes = Transacao.objects.order_by('-data')

    total_receitas = sum(t.valor for t in transacoes if t.tipo == 'R')
    total_despesas = sum(t.valor for t in transacoes if t.tipo == 'D')
    saldo = total_receitas - total_despesas

    # Exemplo: reserva = 20% do saldo positivo
    reserva_sugerida = saldo / 5 if saldo > 0 else Decimal('0')

    context = {
        'transacoes': transacoes,
        'total_receitas': total_receitas,
        'total_despesas': total_despesas,
        'saldo': saldo,
        'reserva_sugerida': reserva_sugerida,
    }
    return render(request, 'core/dashboard.html', context)


def nova_transacao(request):
    if request.method == 'POST':
        form = TransacaoForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('dashboard')
    else:
        form = TransacaoForm(initial={'data': timezone.now().date()})

    return render(request, 'core/form_transacao.html', {'form': form})
