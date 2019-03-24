from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from .models import FlowchartQuestion, Progress
from userprogress.models import TotalCoins, TotalPoints


@login_required
def start(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    user_progress = Progress.objects.get(user=request.user)

    all_questions = FlowchartQuestion.objects.filter(difficulty=user_progress.user_difficulty)

    print(all_questions[0])

    if user_progress.current_question > 3:
        return redirect('final')
    elif user_progress.current_question == 1:
        question = all_questions[0]
    elif user_progress.current_question == 2:
        question = all_questions[1]
    elif user_progress.current_question == 3:
        question = all_questions[2]
    
    
    context = {
        'question': question,
        'current_question': user_progress.current_question,
        'userPoints': userPoints,
        'userCoins': userCoins
    }

    return render(request, 'flowchart/question.html', context)

def submit(request):
    if 'question_id' in request.POST:
        question_id = request.POST['question_id']

    if 'radio' in request.POST:
        user_answer = int(request.POST['radio'])

    if 'answer_number' in request.POST:
        answer_number = int(request.POST['answer_number'])

    # current question being attempted
    question = FlowchartQuestion.objects.get(id=question_id)

    # update user's flowchart progress
    user_progress = Progress.objects.get(user=request.user)
    user_progress.current_question = user_progress.current_question + 1
    if user_answer == int(question.answer):
        user_progress.correct = user_progress.correct + 1
    else:
        user_progress.correct = user_progress.correct
    
    if answer_number == 1:
        user_progress.answer1 = user_answer
    elif answer_number == 2:
        user_progress.answer2 = user_answer
    elif answer_number == 3:
        user_progress.answer3 = user_answer

    user_progress.save()

    if answer_number == 3:
        return redirect('final')

    return redirect('start')

def get_correct_answer(question):
    answer_number = int(question.answer)
    if answer_number == 1:
        return question.option1
    elif answer_number == 2:
        return question.option2
    elif answer_number == 3:
        return question.option3
    elif answer_number == 4:
        return question.option4

def get_option(question, option):
    option = int(option)
    if option == 1:
        return question.option1
    elif option == 2:
        return question.option2
    elif option == 3:
        return question.option3
    elif option == 4:
        return question.option4


@login_required
def final(request):

    # current user's total points
    userPoints = TotalPoints.objects.get(user=request.user)

    # current user's coins
    userCoins = TotalCoins.objects.get(user=request.user)

    user_progress = Progress.objects.get(user=request.user)

    all_questions = FlowchartQuestion.objects.filter(difficulty=user_progress.user_difficulty)

    correct_answers = []
    user_answers = []

    user_answers.append(get_option(all_questions[0], user_progress.answer1))
    user_answers.append(get_option(all_questions[1], user_progress.answer2))
    user_answers.append(get_option(all_questions[2], user_progress.answer3))


    for question in all_questions:
        correct_answers.append(get_correct_answer(question))

    context = {
        'correct_answers': correct_answers,
        'user_answers': user_answers,
        'total_score': user_progress.correct,
        'userPoints': userPoints,
        'userCoins': userCoins
    }
    return render(request, 'flowchart/result.html', context)

def undo(request):
    user_progress = Progress.objects.get(user=request.user)

    user_progress.correct = 0
    user_progress.current_question = 1

    user_progress.save()

    return redirect('start')