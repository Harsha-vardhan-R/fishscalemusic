from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .utils import search_songs

@api_view(['POST'])
def search_chords(request):
    chords = request.data.get('chords', [])
    if not isinstance(chords, list):
        return Response({'error': 'chords must be a list'}, status=status.HTTP_400_BAD_REQUEST)
    if len(chords) < 2:
        return Response({'error': 'At least 2 chords required'}, status=status.HTTP_400_BAD_REQUEST)
    results = search_songs(chords, top_n=25)
    return Response({'results': results, 'count': len(results)}, status=status.HTTP_200_OK)
